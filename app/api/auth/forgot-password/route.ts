import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetOtp } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    // Enforce rate limit: 1 reset request per user per day
    const today = new Date().toDateString()
    const lastResetDate = existingUser.lastResetAt
      ? new Date(existingUser.lastResetAt).toDateString()
      : null

    if (lastResetDate && today === lastResetDate) {
      return NextResponse.json(
        { error: 'Password reset is limited to once per day. Please try again tomorrow.' },
        { status: 429 }
      )
    }

    // Generate 6-digit verification code (OTP)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Send the email
    const emailSent = await sendPasswordResetOtp({
      to: existingUser.email,
      name: existingUser.name || 'User',
      otpCode: otp,
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      )
    }

    // Save OTP & update lastResetAt to block further attempts today
    await db
      .update(users)
      .set({
        resetOtp: otp,
        resetOtpExpires: expires,
        lastResetAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))

    return NextResponse.json({
      success: true,
      message: 'Password reset code has been sent to your email',
    })
  } catch (error) {
    console.error('Forgot Password Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
