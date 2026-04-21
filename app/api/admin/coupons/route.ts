import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allCoupons = await db.query.coupons.findMany({
      orderBy: [desc(coupons.createdAt)],
    });
    return NextResponse.json(allCoupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, discountType, discountValue, expiresAt, usageLimit } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newCoupon] = await db.insert(coupons).values({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit,
    }).returning();

    return NextResponse.json(newCoupon);
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
