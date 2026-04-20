import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
