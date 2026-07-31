import { db } from '@/lib/db'
import { feedback, feedbackReplies } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { sendFeedbackNotification } from '@/lib/mail'

// POST /api/feedback — public submit
export async function POST(req: NextRequest) {
  try {
    const { name, email, type, subject, message } = await req.json()

    if (!name || !email || !type || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message is too short.' }, { status: 400 })
    }

    const [newFeedback] = await db
      .insert(feedback)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        type,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        isPublic: true,
      })
      .returning()

    sendFeedbackNotification({
      name,
      email,
      type,
      subject,
      message,
      feedbackId: newFeedback.id,
    }).catch((err) => console.error('Failed to send feedback notification email:', err))

    return NextResponse.json({ success: true, id: newFeedback.id })
  } catch (err) {
    console.error('Feedback submit error:', err)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}

// GET /api/feedback — public list (emails stripped)
export async function GET() {
  try {
    const items = await db.query.feedback.findMany({
      where: eq(feedback.isPublic, true),
      orderBy: [desc(feedback.createdAt)],
      with: {
        replies: {
          orderBy: [desc(feedbackReplies.createdAt)],
        },
      },
    })

    const sanitized = items.map(({ email: _email, ...rest }) => rest)
    return NextResponse.json(sanitized)
  } catch (err) {
    console.error('Feedback list error:', err)
    return NextResponse.json({ error: 'Failed to load.' }, { status: 500 })
  }
}
