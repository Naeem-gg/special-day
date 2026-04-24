import { db } from "@/lib/db";
import { invitations, coupons } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendPurchaseReceipt } from "@/lib/mail";

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
      sendPurchaseReceipt({
        to: userEmail,
        brideName,
        groomName,
        planName: tier || "basic",
        amountPaid: paidAmount || 0,
        orderId: razorpay_order_id,
        invitationLink: `${baseUrl}/invite/${slug}`,
      }).catch((err) => console.error("Failed to send receipt:", err));
    }

    return NextResponse.json({ success: true, data: newInvitation });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify payment and save invitation" }, { status: 500 });
  }
}
