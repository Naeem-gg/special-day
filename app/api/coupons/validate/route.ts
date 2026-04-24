import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await db.query.coupons.findFirst({
      where: and(
        eq(coupons.code, code.toUpperCase()),
        eq(coupons.active, true)
      ),
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    let tierRestriction = null;
    if (coupon.code.startsWith("GIFT-")) {
      const parts = coupon.code.split("-");
      if (parts.length >= 3) {
        tierRestriction = parts[1].toLowerCase();
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        tierRestriction,
      },
    });
  } catch (error) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
