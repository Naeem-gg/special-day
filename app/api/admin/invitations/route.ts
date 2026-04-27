import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const allInvitations = await db.query.invitations.findMany({
      orderBy: [desc(invitations.createdAt)],
    })
    return NextResponse.json(allInvitations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await db.delete(invitations).where(eq(invitations.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 })
  }
}
