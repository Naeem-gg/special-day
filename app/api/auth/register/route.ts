import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 400 })
      }

      const today = new Date().toDateString()
      const lastOtpDate = existingUser.lastOtpAt
        ? new Date(existingUser.lastOtpAt).toDateString()
        : null

      let count = existingUser.otpCountToday
      if (today !== lastOtpDate) {
        count = 0
      }

      if (count >= 2) {
        return NextResponse.json(
          { error: 'Daily limit reached. You can only receive 2 verification emails per day.' },
          { status: 429 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    if (existingUser) {
      const today = new Date().toDateString()
      const lastOtpDate = existingUser.lastOtpAt
        ? new Date(existingUser.lastOtpAt).toDateString()
        : null
      const newCount = today === lastOtpDate ? existingUser.otpCountToday + 1 : 1

      // Update unverified user with new password and OTP
      await db
        .update(users)
        .set({
          password: hashedPassword,
          loginOtp: otp,
          loginOtpExpires: expires,
          otpCountToday: newCount,
          lastOtpAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
    } else {
      // Create new user
      await db.insert(users).values({
        email,
        password: hashedPassword,
        loginOtp: otp,
        loginOtpExpires: expires,
        emailVerified: false,
        otpCountToday: 1,
        lastOtpAt: new Date(),
      })
    }

    // Send OTP via email
    const emailSent = await sendEmail({
      to: email,
      subject: `Verify Your Email: ${otp}`,
      htmlContent: `<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #fce4ec; border-radius: 24px; text-align: center; background-color: #ffffff; box-shadow: 0 10px 25px rgba(244, 63, 143, 0.05);">
        <div style="margin-bottom: 30px;">
          <img src="https://dnvites.com/logo.png" alt="DNvites" style="width: 140px; height: auto;">
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 300; margin-bottom: 20px;">Welcome to DNvites!</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">To complete your sign-up and start creating your beautiful wedding invitations, please use the following verification code:</p>
        <div style="background-color: #fdf2f8; padding: 30px; border-radius: 16px; border: 1px dashed #F43F8F; margin-bottom: 30px;">
          <h1 style="font-size: 42px; letter-spacing: 8px; color: #1a1a1a; margin: 0; font-family: monospace;">${otp}</h1>
        </div>
        <p style="color: #999; font-size: 14px; margin-bottom: 40px;">This code is valid for the next 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin-bottom: 30px;">
        <p style="color: #1a1a1a; font-size: 14px; font-weight: bold; margin-bottom: 40px;">DNvites — Premium Digital Invitations</p>
      </div>`,
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Verification OTP sent' })
  } catch (error) {
    console.error('Register Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
