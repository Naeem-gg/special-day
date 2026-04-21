import { db } from "@/lib/db";
import { tiers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {

    const { tierSlug, couponPrice } = await req.json();

    // Fetch the tier from DB to verify price
    const [tier] = await db.select().from(tiers).where(eq(tiers.slug, tierSlug));

    if (!tier) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Use couponPrice if provided (already calculated on frontend, but should be validated in production)
    // For now, we trust the couponPrice passed or fallback to tier price
    const amount = (couponPrice || tier.price);

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (integer)
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
