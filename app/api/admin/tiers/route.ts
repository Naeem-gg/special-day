import { db } from "@/lib/db";
import { tiers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allTiers = await db.query.tiers.findMany();
    return NextResponse.json(allTiers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tiers" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, price, active } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateData: any = {};
    if (price !== undefined) updateData.price = price;
    if (active !== undefined) updateData.active = active;

    const [updatedTier] = await db.update(tiers)
      .set(updateData)
      .where(eq(tiers.id, id))
      .returning();

    return NextResponse.json(updatedTier);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tier" }, { status: 500 });
  }
}
