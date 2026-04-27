import { db } from '@/lib/db'
import { tiers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const activeTiers = await db.query.tiers.findMany({
      where: eq(tiers.active, true),
    })
    return NextResponse.json(activeTiers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 })
  }
}
