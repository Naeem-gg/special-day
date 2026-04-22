import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { userLogin } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || user.loginOtp !== otp) {
      return NextResponse.json({ error: "Invalid login code" }, { status: 401 });
    }

    if (!user.loginOtpExpires || new Date() > user.loginOtpExpires) {
      return NextResponse.json({ error: "Login code has expired" }, { status: 401 });
    }

    // Clear OTP, set verified, and create session
    await db.update(users).set({ 
      loginOtp: null, 
      loginOtpExpires: null,
      emailVerified: true 
    }).where(eq(users.id, user.id));
    await userLogin(user.id, user.email);

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
