import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Check daily limit (Total 2 emails per day)
    const today = new Date().toDateString();
    const lastOtpDate = existingUser.lastOtpAt ? new Date(existingUser.lastOtpAt).toDateString() : null;
    let count = (today === lastOtpDate) ? existingUser.otpCountToday : 0;

    if (count >= 2) {
      return NextResponse.json({ error: "Daily limit reached. You can only receive 2 verification emails per day." }, { status: 429 });
    }

    // Rate limiting (Wait at least 60 seconds between resends)
    if (existingUser.lastOtpAt) {
      const now = new Date();
      const lastResend = new Date(existingUser.lastOtpAt);
      const diffInSeconds = Math.floor((now.getTime() - lastResend.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return NextResponse.json({ error: `Please wait ${60 - diffInSeconds}s before resending.` }, { status: 429 });
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await db.update(users).set({ 
      loginOtp: otp, 
      loginOtpExpires: expires,
      otpCountToday: count + 1,
      lastOtpAt: new Date()
    }).where(eq(users.id, existingUser.id));

    // Send OTP via email
    const emailSent = await sendEmail({
      to: email,
      subject: "New Verification Code - DNvites",
      htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h2>Your New Verification Code</h2>
        <p>You requested a new code. Here it is:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px; color: #F43F8F;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Note: This is your final resend attempt.</p>
      </div>`,
    });

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "New OTP sent" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
