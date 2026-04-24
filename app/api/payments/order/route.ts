import { db } from "@/lib/db";
import { tiers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {

    const { tierSlug, couponCode } = await req.json();

    // 1. Fetch the tier from DB to get the true base price
    const [tier] = await db.select().from(tiers).where(eq(tiers.slug, tierSlug));
    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    let finalAmount = tier.price;

    // 2. If a coupon is provided, validate it strictly on the server
    if (couponCode) {
      const { coupons } = await import("@/lib/db/schema");
      const { and } = await import("drizzle-orm");
      
      const coupon = await db.query.coupons.findFirst({
        where: and(
          eq(coupons.code, couponCode.toUpperCase()),
          eq(coupons.active, true)
        ),
      });

      if (coupon) {
        // Check expiration
        const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
        // Check usage limit
        const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        
        if (!isExpired && !isLimitReached) {
          // Apply discount
          if (coupon.discountType === "percentage") {
            finalAmount = Math.round(tier.price * (1 - coupon.discountValue / 100));
          } else {
            finalAmount = Math.max(0, tier.price - coupon.discountValue);
          }
        }
      }
    }

    // 3. Create the Razorpay order with the SECURELY calculated amount
    const options = {
      amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise (integer)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    const errorMessage = error.error?.description || error.message || "Failed to initiate payment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
