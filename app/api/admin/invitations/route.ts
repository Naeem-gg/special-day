import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const allInvitations = await db.query.invitations.findMany({
      orderBy: [desc(invitations.createdAt)],
    })
    return NextResponse.json(allInvitations)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await db.delete(invitations).where(eq(invitations.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id, editWindowOverride } = await req.json()
    if (id === undefined || editWindowOverride === undefined) {
      return NextResponse.json({ error: 'ID and editWindowOverride are required' }, { status: 400 })
    }

    await db.update(invitations).set({ editWindowOverride }).where(eq(invitations.id, id))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update invitation edit override' }, { status: 500 })
  }
}
