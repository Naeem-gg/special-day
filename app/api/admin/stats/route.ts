import { db } from "@/lib/db";
import { invitations, rsvps, coupons } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [invitationCount] = await db.select({ value: count() }).from(invitations);
    const [rsvpCount] = await db.select({ value: count() }).from(rsvps);
    const [couponCount] = await db.select({ value: count() }).from(coupons);

    // Calculate estimated revenue
    const allInvitations = await db.query.invitations.findMany();
    const totalPotentialRevenue = allInvitations.reduce((acc, inv) => {
      let price = 0;
      if (inv.tier === "basic") price = 399;
      if (inv.tier === "standard") price = 799;
      if (inv.tier === "premium") price = 999;
      return acc + (inv.paidAmount || price);
    }, 0);

    return NextResponse.json({
      stats: {
        totalInvitations: invitationCount.value,
        totalRSVPs: rsvpCount.value,
        activeCoupons: couponCount.value,
        estimatedRevenue: totalPotentialRevenue,
      },
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
