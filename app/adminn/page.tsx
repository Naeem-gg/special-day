import { db } from "@/lib/db";
import { invitations, coupons, tiers, rsvps } from "@/lib/db/schema";
import { desc, count } from "drizzle-orm";
import { AdminClientPage } from "./ClientPage";

export default async function AdminPage() {
  // Fetch all required data on the server
  const allInvitations = await db.select().from(invitations).orderBy(desc(invitations.createdAt));
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  const allTiers = await db.select().from(tiers);

  const [rsvpCount] = await db.select({ value: count() }).from(rsvps);

  const totalPotentialRevenue = allInvitations.reduce((acc, inv) => {
    let price = 0;
    if (inv.tier === "basic") price = 399;
    if (inv.tier === "standard") price = 799;
    if (inv.tier === "premium") price = 999;
    return acc + (inv.paidAmount || price);
  }, 0);

  const stats = {
    totalInvitations: allInvitations.length,
    totalRSVPs: rsvpCount.value,
    activeCoupons: allCoupons.length,
    estimatedRevenue: totalPotentialRevenue,
  };

  return (
    <AdminClientPage
      initialStats={stats}
      initialInvitations={allInvitations}
      initialCoupons={allCoupons}
      initialTiers={allTiers}
    />
  );
}
