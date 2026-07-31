import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invitations } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const cookieStore = await cookies()
    const cookieName = `viewed_${slug}`.slice(0, 64)
    const alreadyViewed = cookieStore.get(cookieName)

    if (alreadyViewed) {
      return NextResponse.json({ success: true, counted: false })
    }

    await db
      .update(invitations)
      .set({ views: sql`${invitations.views} + 1` })
      .where(eq(invitations.slug, slug))

    const res = NextResponse.json({ success: true, counted: true })
    res.cookies.set(cookieName, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    })
    return res
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
