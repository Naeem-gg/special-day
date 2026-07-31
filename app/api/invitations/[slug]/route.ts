import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getUserSession, getSession } from '@/lib/auth-utils'
import { clampGallery, getGalleryLimit } from '@/lib/invitation-limits'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.slug, slug),
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const session = await getUserSession()
    const adminSession = await getSession()
    const isOwner =
      !!session?.email &&
      !!invitation.userEmail &&
      invitation.userEmail.toLowerCase() === String(session.email).toLowerCase()

    if (!isOwner && !adminSession) {
      const {
        userEmail: _email,
        razorpayOrderId: _order,
        razorpayPaymentId: _pay,
        couponId: _coupon,
        paidAmount: _paid,
        discountApplied: _disc,
        ...publicData
      } = invitation
      return NextResponse.json(publicData)
    }

    return NextResponse.json(invitation)
  } catch (error) {
    console.error('Fetch Invitation Error:', error)
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const session = await getUserSession()
    const adminSession = await getSession()

    if (!session && !adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      brideName,
      groomName,
      date,
      venue,
      events,
      gallery,
      musicUrl,
      template,
      language,
      ourStory,
      mapUrl,
      rsvpButtonText,
      tier,
      paidAmount,
    } = body

    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.slug, slug),
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    if (!adminSession) {
      if (
        !session?.email ||
        !invitation.userEmail ||
        invitation.userEmail.toLowerCase() !== String(session.email).toLowerCase()
      ) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      if (!invitation.editWindowOverride) {
        const createdDate = new Date(invitation.createdAt)
        const now = new Date()
        const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)

        if (diffInHours > 48) {
          return NextResponse.json(
            { error: 'Editing window has closed (48 hours passed)' },
            { status: 403 }
          )
        }
      }
    }

    const effectiveTier = adminSession && tier ? tier : invitation.tier
    if (gallery && Array.isArray(gallery) && gallery.length > getGalleryLimit(effectiveTier)) {
      return NextResponse.json(
        {
          error: `This plan allows up to ${getGalleryLimit(effectiveTier)} photo(s)`,
        },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      brideName,
      groomName,
      date: new Date(date),
      venue,
      events,
      gallery: gallery ? clampGallery(gallery, effectiveTier) : gallery,
      musicUrl,
      template,
      language: language || 'en',
      ourStory,
      mapUrl,
      rsvpButtonText: rsvpButtonText || 'RSVP Now',
    }

    if (adminSession) {
      if (tier !== undefined) updateData.tier = tier
      if (paidAmount !== undefined) updateData.paidAmount = paidAmount
    }

    await db.update(invitations).set(updateData).where(eq(invitations.id, invitation.id))

    return NextResponse.json({ success: true, message: 'Invitation updated successfully' })
  } catch (error) {
    console.error('Update Invitation Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
