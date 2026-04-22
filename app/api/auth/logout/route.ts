import { userLogout } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST() {
  await userLogout();
  return NextResponse.json({ success: true });
}
