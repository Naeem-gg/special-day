import { db } from '@/lib/db'
import { tiers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const allTiers = await db.query.tiers.findMany()
    return NextResponse.json(allTiers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id, price, strikePrice, active } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const updateData: Record<string, unknown> = {}
    if (price !== undefined) updateData.price = price
    if (strikePrice !== undefined) updateData.strikePrice = strikePrice
    if (active !== undefined) updateData.active = active

    const [updatedTier] = await db
      .update(tiers)
      .set(updateData)
      .where(eq(tiers.id, id))
      .returning()

    return NextResponse.json(updatedTier)
  } catch {
    return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 })
  }
}
