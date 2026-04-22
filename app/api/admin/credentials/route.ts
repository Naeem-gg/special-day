import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const { otp, username, password } = await req.json();

    if (!otp || !username || !password) {
      return NextResponse.json({ error: "OTP, username, and password are required" }, { status: 400 });
    }

    const admin = await db.query.admins.findFirst();
    if (!admin) {
      return NextResponse.json({ error: "No admin found" }, { status: 404 });
    }

    if (!admin.resetOtp || admin.resetOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (!admin.resetOtpExpires || admin.resetOtpExpires < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.update(admins).set({
      username: username,
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpires: null,
    }).where(eq(admins.id, admin.id));

    return NextResponse.json({ success: true, message: "Credentials updated successfully" });
  } catch (error) {
    console.error("Credentials Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
