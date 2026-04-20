import { db } from "@/lib/db";
import { rsvps } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, name, guests, attending } = body;

    if (!invitationId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newRsvp] = await db.insert(rsvps).values({
      invitationId,
      name,
      guests: guests || 1,
      attending: attending !== undefined ? attending : true,
    }).returning();

    return NextResponse.json({ success: true, data: newRsvp });
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
  }
}
