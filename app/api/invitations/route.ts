import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      slug, 
      brideName, 
      groomName, 
      date, 
      venue, 
      events, 
      gallery, 
      musicUrl, 
      backgroundImage,
      tier
    } = body;

    if (!slug || !brideName || !groomName || !date || !venue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newInvitation] = await db.insert(invitations).values({
      slug,
      brideName,
      groomName,
      date: new Date(date),
      venue,
      events: events || [],
      gallery: gallery || [],
      musicUrl,
      backgroundImage,
      tier: tier || "basic"
    }).returning();

    return NextResponse.json({ success: true, data: newInvitation });
  } catch (error) {
    console.error("Create Invitation Error:", error);
    // Check for unique constraint on slug
    if (error instanceof Error && error.message.includes("unique constraint")) {
       return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 });
  }
}
