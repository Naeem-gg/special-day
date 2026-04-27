import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { getSession } from '@/lib/auth-utils'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// GET all testimonials for admin
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin Testimonials GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
