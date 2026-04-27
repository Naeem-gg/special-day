import { db } from '@/lib/db'
import { invitations, coupons, tiers, rsvps, testimonials } from '@/lib/db/schema'
import { desc, count } from 'drizzle-orm'
import { AdminClientPage } from './ClientPage'
import { getSession } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) {
    redirect('/adminn/login')
  }

  // Fetch all required data on the server
  const allInvitations = await db.select().from(invitations).orderBy(desc(invitations.createdAt))
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt))
  const allTiers = await db.select().from(tiers)

  let allTestimonials: any[] = []
  try {
    allTestimonials = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
  } catch (err) {
    console.error('Admin: Failed to fetch testimonials:', err)
  }

  const [rsvpCount] = await db.select({ value: count() }).from(rsvps)

  const totalPotentialRevenue = allInvitations.reduce((acc, inv) => {
    let price = 0
    if (inv.tier === 'basic') price = 399
    if (inv.tier === 'standard') price = 799
    if (inv.tier === 'premium') price = 999
    return acc + (inv.paidAmount || price)
  }, 0)

  const stats = {
    totalInvitations: allInvitations.length,
    totalRSVPs: rsvpCount.value,
    activeCoupons: allCoupons.length,
    estimatedRevenue: totalPotentialRevenue,
  }

  return (
    <AdminClientPage
      initialStats={stats}
      initialInvitations={allInvitations}
      initialCoupons={allCoupons}
      initialTiers={allTiers}
      initialTestimonials={allTestimonials}
    />
  )
}
