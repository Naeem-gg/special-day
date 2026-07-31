import { db } from '@/lib/db'
import { invitations, rsvps, coupons } from '@/lib/db/schema'
import { count } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const [invitationCount] = await db.select({ value: count() }).from(invitations)
    const [rsvpCount] = await db.select({ value: count() }).from(rsvps)
    const [couponCount] = await db.select({ value: count() }).from(coupons)

    const allInvitations = await db.query.invitations.findMany()
    const totalPotentialRevenue = allInvitations.reduce((acc, inv) => {
      return acc + (inv.paidAmount || 0)
    }, 0)

    return NextResponse.json({
      stats: {
        totalInvitations: invitationCount.value,
        totalRSVPs: rsvpCount.value,
        activeCoupons: couponCount.value,
        estimatedRevenue: totalPotentialRevenue,
      },
    })
  } catch (error) {
    console.error('Admin Stats Error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
