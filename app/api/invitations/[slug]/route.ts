import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { getUserSession } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.slug, slug),
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Fetch Invitation Error:", error);
    return NextResponse.json({ error: "Failed to fetch invitation" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { brideName, groomName, date, venue, events, gallery, musicUrl, template, language, ourStory, mapUrl } = body;

    // Find invitation
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.slug, slug),
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Security: Check ownership
    if (invitation.userEmail !== session.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Security: Check 48h limit
    const createdDate = new Date(invitation.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours > 48) {
      return NextResponse.json({ error: "Editing window has closed (48 hours passed)" }, { status: 403 });
    }

    // Update
    await db.update(invitations)
      .set({
        brideName,
        groomName,
        date: new Date(date),
        venue,
        events,
        gallery,
        musicUrl,
        template,
        language,
        ourStory,
        mapUrl
      })
      .where(eq(invitations.id, invitation.id));

    return NextResponse.json({ success: true, message: "Invitation updated successfully" });
  } catch (error) {
    console.error("Update Invitation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
