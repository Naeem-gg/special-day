import { db } from "@/lib/db";
import { invitations, coupons } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      invitationData 
    } = await req.json();

    // Verify signature
    const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Payment is verified, now save the invitation
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
      couponId,
      discountApplied,
      paidAmount
    } = invitationData;

    const newInvitation = await db.transaction(async (tx) => {
      const [inv] = await tx.insert(invitations).values({
        slug,
        brideName,
        groomName,
        date: new Date(date),
        venue,
        events: events || [],
        gallery: gallery || [],
        musicUrl,
        backgroundImage,
        tier: tier || "basic",
        couponId: couponId || null,
        discountApplied: discountApplied || 0,
        paidAmount: paidAmount || 0,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      }).returning();

      if (couponId) {
        await tx.update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(eq(coupons.id, couponId));
      }

      return inv;
    });

    return NextResponse.json({ success: true, data: newInvitation });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify payment and save invitation" }, { status: 500 });
  }
}
