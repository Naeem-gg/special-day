import { db } from '@/lib/db'
import { admins } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'

export async function POST() {
  try {
    const admin = await db.query.admins.findFirst()
    if (!admin) {
      return NextResponse.json({ error: 'No admin found' }, { status: 404 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await db
      .update(admins)
      .set({
        resetOtp: otp,
        resetOtpExpires: expires,
      })
      .where(eq(admins.id, admin.id))

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #F43F8F;">Admin Credentials Update</h2>
        <p>You requested to change your admin username and password.</p>
        <p>Your one-time password (OTP) is: <strong style="font-size: 20px; background: #f9f9f9; padding: 4px 8px; border-radius: 4px;">${otp}</strong></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
      </div>
    `

    await sendEmail({
      to: 'dnvites@duck.com',
      subject: 'Your DNvites Admin OTP',
      htmlContent,
    })

    return NextResponse.json({ success: true, message: 'OTP sent to dnvites@duck.com' })
  } catch (error) {
    console.error('OTP Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
