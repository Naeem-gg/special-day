import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  (process.env.ENCRYPTION_KEY || "fallback-secret-key-32-chars-min!").padEnd(32, "0").slice(0, 32)
);

export async function POST(req: NextRequest) {
  try {
    const { brideName, groomName, dateStr, template } = await req.json();

    if (!brideName || !groomName || !dateStr || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = await new SignJWT({ brideName, groomName, dateStr, template })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m") // 5 minutes
      .sign(SECRET);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Preview token error:", error);
    return NextResponse.json({ error: "Failed to generate preview token" }, { status: 500 });
  }
}
