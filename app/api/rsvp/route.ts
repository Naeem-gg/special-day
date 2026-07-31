import { db } from '@/lib/db'
import { rsvps, invitations } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { isInvitationExpired } from '@/lib/invitation-limits'

const MAX_GUESTS = 20

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { invitationId, name, guests, attending } = body

    if (!invitationId || !name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const guestCount = Math.min(Math.max(parseInt(String(guests || 1), 10) || 1, 1), MAX_GUESTS)
    const trimmedName = name.trim().slice(0, 100)

    const [invitation] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, invitationId))

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    if (invitation.tier === 'basic') {
      return NextResponse.json({ error: 'RSVP not available for this plan' }, { status: 403 })
    }

    if (isInvitationExpired(invitation.createdAt, invitation.tier)) {
      return NextResponse.json({ error: 'This invitation has expired' }, { status: 403 })
    }

    // Prevent obvious duplicates (same name, case-insensitive, within invitation)
    const [duplicate] = await db
      .select({ id: rsvps.id })
      .from(rsvps)
      .where(
        and(
          eq(rsvps.invitationId, invitationId),
          sql`lower(${rsvps.name}) = ${trimmedName.toLowerCase()}`
        )
      )
      .limit(1)

    if (duplicate) {
      return NextResponse.json(
        { error: 'An RSVP with this name was already submitted' },
        { status: 409 }
      )
    }

    const [newRsvp] = await db
      .insert(rsvps)
      .values({
        invitationId,
        name: trimmedName,
        guests: guestCount,
        attending: attending !== undefined ? Boolean(attending) : true,
      })
      .returning()

    return NextResponse.json({ success: true, data: newRsvp })
  } catch (error) {
    console.error('RSVP Error:', error)
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 })
  }
}
