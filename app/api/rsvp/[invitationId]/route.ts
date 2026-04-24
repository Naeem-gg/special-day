import { db } from "@/lib/db";
import { rsvps, invitations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId: rawInvitationId } = await params;
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitationId = parseInt(rawInvitationId);
    if (isNaN(invitationId)) {
      return NextResponse.json({ error: "Invalid Invitation ID" }, { status: 400 });
    }

    // Security: Verify the invitation belongs to the current user
    const [invitation] = await db.select().from(invitations).where(
      and(
        eq(invitations.id, invitationId),
        eq(invitations.userEmail, session.email)
      )
    );

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or access denied" }, { status: 404 });
    }

    // Fetch RSVPs
    const invitationRsvps = await db.select().from(rsvps).where(
      eq(rsvps.invitationId, invitationId)
    ).orderBy(rsvps.createdAt);

    return NextResponse.json({ success: true, data: invitationRsvps });
  } catch (error) {
    console.error("Fetch RSVPs Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId: rawInvitationId } = await params;
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rsvpId } = await req.json();
    if (!rsvpId) {
      return NextResponse.json({ error: "RSVP ID required" }, { status: 400 });
    }

    const invitationId = parseInt(rawInvitationId);

    // Security: Verify the invitation belongs to the current user
    const [invitation] = await db.select().from(invitations).where(
      and(
        eq(invitations.id, invitationId),
        eq(invitations.userEmail, session.email)
      )
    );

    if (!invitation) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete RSVP
    await db.delete(rsvps).where(
      and(
        eq(rsvps.id, rsvpId),
        eq(rsvps.invitationId, invitationId)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete RSVP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
