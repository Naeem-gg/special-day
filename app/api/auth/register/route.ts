import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
      // Update unverified user with new password and OTP
      await db.update(users).set({
        password: hashedPassword,
        loginOtp: otp,
        loginOtpExpires: expires,
      }).where(eq(users.id, existingUser.id));
    } else {
      // Create new user
      await db.insert(users).values({
        email,
        password: hashedPassword,
        loginOtp: otp,
        loginOtpExpires: expires,
        emailVerified: false,
      });
    }

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Verify Your Email - DNvites",
      htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <h2>Welcome to DNvites!</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px; color: #F43F8F;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>`,
    });

    return NextResponse.json({ success: true, message: "Verification OTP sent" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
