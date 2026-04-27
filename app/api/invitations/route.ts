import { db } from '@/lib/db'
import { invitations, coupons } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
      paidAmount,
      ourStory,
      mapUrl,
    } = body

    if (!slug || !brideName || !groomName || !date || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use a transaction to ensure invitation creation and coupon update are atomic
    const [newInvitation] = await db
      .insert(invitations)
      .values({
        slug,
        brideName,
        groomName,
        date: new Date(date),
        venue,
        events: events || [],
        gallery: gallery || [],
        musicUrl,
        backgroundImage,
        tier: tier || 'basic',
        couponId: couponId || null,
        discountApplied: discountApplied || 0,
        paidAmount: paidAmount || 0,
        ourStory: ourStory || null,
        mapUrl: mapUrl || null,
      })
      .returning()

    if (couponId) {
      await db
        .update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(eq(coupons.id, couponId))
    }

    return NextResponse.json({ success: true, data: newInvitation })
  } catch (error) {
    console.error('Create Invitation Error:', error)
    // Check for unique constraint on slug
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 })
  }
}
