import { db } from '@/lib/db'
import { testimonials, invitations } from '@/lib/db/schema'
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// GET public testimonials
export async function GET() {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublic, true))
      .orderBy(desc(testimonials.createdAt))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Testimonials GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST a new testimonial
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, rating, message } = body

    if (!name || !email || !rating || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if the user has at least one invitation (case-insensitive)
    const userInvitation = await db
      .select()
      .from(invitations)
      .where(sql`lower(${invitations.userEmail}) = ${normalizedEmail}`)
      .limit(1)

    if (userInvitation.length === 0) {
      return NextResponse.json(
        {
          error: 'Verified purchase required. Please use the email you used for your order.',
        },
        { status: 403 }
      )
    }

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        name,
        email,
        rating: parseInt(rating),
        message,
        isPublic: false, // Default to private until admin approves
      })
      .returning()

    return NextResponse.json(newTestimonial[0])
  } catch (error) {
    console.error('Testimonials POST Error:', error)
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 })
  }
}
