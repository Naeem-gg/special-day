import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { userLogin } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser || !existingUser.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!existingUser.emailVerified) {
      // Send OTP via email
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      await db.update(users).set({ loginOtp: otp, loginOtpExpires: expires }).where(eq(users.id, existingUser.id));

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

      return NextResponse.json({ success: true, needsVerification: true, message: "Verification OTP sent" });
    }

    // Create session if already verified
    await userLogin(existingUser.id, existingUser.email);

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
