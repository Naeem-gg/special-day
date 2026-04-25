import { db } from "@/lib/db";
import { invitations, coupons } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendPurchaseReceipt } from "@/lib/mail";
import { razorpay } from "@/lib/razorpay";
import { tiers as tiersTable } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      invitationData,
      bypassPayment
    } = await req.json();

    if (!bypassPayment) {
      // Verify signature
      const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }

      // ─── ANTI-MANIPULATION CHECK ───
      // Fetch the actual payment from Razorpay to verify the amount
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      // Re-calculate what the price SHOULD be based on the tier and coupon in the request
      const { tier, couponId } = invitationData;
      const [dbTier] = await db.select().from(tiersTable).where(eq(tiersTable.slug, tier || "basic"));
      
      if (!dbTier) {
        return NextResponse.json({ error: "Invalid tier in invitation data" }, { status: 400 });
      }

      let expectedAmount = dbTier.price;
      if (couponId) {
        const coupon = await db.query.coupons.findFirst({
          where: eq(coupons.id, couponId),
        });
        if (coupon && coupon.active) {
          if (coupon.discountType === "percentage") {
            expectedAmount = Math.round(dbTier.price * (1 - coupon.discountValue / 100));
          } else {
            expectedAmount = Math.max(0, dbTier.price - coupon.discountValue);
          }
        }
      }

      // Check if the amount actually paid matches our server-side calculation
      // Razorpay amount is in paise
      if (payment.amount !== expectedAmount * 100) {
        console.error("PRICE MANIPULATION DETECTED:", {
          paid: payment.amount,
          expected: expectedAmount * 100,
          user: invitationData.userEmail
        });
        return NextResponse.json({ error: "Price mismatch. Payment rejected." }, { status: 400 });
      }
      // ──────────────────────────────
    } else {
      // If bypassPayment is true, we MUST verify the coupon actually results in 0 cost
      const { couponId, tier } = invitationData;
      if (!couponId) {
        return NextResponse.json({ error: "Bypass payment requires a coupon" }, { status: 403 });
      }

      // Fetch coupon from DB
      const coupon = await db.query.coupons.findFirst({
        where: eq(coupons.id, couponId),
      });

      if (!coupon || !coupon.active) {
        return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 403 });
      }

      // Check if it's a 100% discount
      const isFullDiscount = coupon.discountType === "percentage" && coupon.discountValue === 100;
      
      // If it's not a 100% discount, check if it's a fixed discount that covers the whole price
      let isFixedFullDiscount = false;
      if (coupon.discountType === "fixed") {
        const { tiers } = await import("@/lib/db/schema");
        const [tierData] = await db.select().from(tiers).where(eq(tiers.slug, tier || "basic"));
        if (tierData && coupon.discountValue >= tierData.price) {
          isFixedFullDiscount = true;
        }
      }

      if (!isFullDiscount && !isFixedFullDiscount) {
        return NextResponse.json({ error: "This coupon does not cover the full amount. Payment is required." }, { status: 403 });
      }
    }

    // Payment is verified
    if (invitationData.isGift) {
      const { tier, userEmail, senderName } = invitationData;
      
      // Generate a 100% discount coupon restricted to the tier
      // Format: GIFT-[TIER]-[RANDOM]
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const giftCode = `GIFT-${tier.toUpperCase()}-${randomSuffix}`;
      
      const [newCoupon] = await db.insert(coupons).values({
        code: giftCode,
        discountType: "percentage",
        discountValue: 100,
        usageLimit: 1,
        active: true
      }).returning();

      // Send the gift code via email
      if (userEmail) {
        const { sendGiftCoupon } = await import("@/lib/mail");
        sendGiftCoupon({
          to: userEmail,
          planName: tier,
          couponCode: giftCode,
          senderName: senderName || "A friend",
        }).catch(err => console.error("Failed to send gift email:", err));
      }

      return NextResponse.json({ 
        success: true, 
        isGift: true, 
        giftCode: giftCode 
      });
    }

    // Otherwise, save the invitation (original logic)
    const { 
      slug, 
      brideName, 
      groomName, 
      date, 
      venue, 
      events, 
      gallery, 
      musicUrl, 
      backgroundImage,
      tier,
      template,
      couponId,
      discountApplied,
      paidAmount,
      userEmail
    } = invitationData;

    const [newInvitation] = await db.insert(invitations).values({
      slug,
      brideName,
      groomName,
      userEmail,
      date: new Date(date),
      venue,
      events: events || [],
      gallery: gallery || [],
      musicUrl,
      backgroundImage,
      tier: tier || "basic",
      template: template || "rose-gold",
      couponId: couponId || null,
      discountApplied: discountApplied || 0,
      paidAmount: paidAmount || 0,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    }).returning();

    if (couponId) {
      await db.update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(eq(coupons.id, couponId));
    }

    // Send the email in the background if email is provided
    if (userEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dnvites.com";
      // Format a professional brand order ID: #DNV + first 8 chars of razorpay ID
      const displayOrderId = `#DNV${razorpay_order_id.replace('order_', '').substring(0, 8).toUpperCase()}`;
      
      sendPurchaseReceipt({
        to: userEmail,
        brideName,
        groomName,
        planName: tier || "basic",
        amountPaid: paidAmount || 0,
        orderId: displayOrderId,
        invitationLink: `${baseUrl}/invite/${slug}`,
      }).catch((err) => console.error("Failed to send receipt:", err));
    }

    return NextResponse.json({ success: true, data: newInvitation });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify payment and save invitation" }, { status: 500 });
  }
}
