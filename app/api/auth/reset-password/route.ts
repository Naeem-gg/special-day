import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { userLogin } from '@/lib/auth-utils'

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json()

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
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

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 401 })
    }

    if (!user.resetOtpExpires || new Date() > user.resetOtpExpires) {
      return NextResponse.json({ error: 'Reset code has expired' }, { status: 401 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password, clear OTP columns and mark email verified
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpires: null,
        emailVerified: true, // Resetting successfully also verifies the email
      })
      .where(eq(users.id, user.id))

    // Automatically log user in
    await userLogin(user.id, user.email)

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset Password Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
