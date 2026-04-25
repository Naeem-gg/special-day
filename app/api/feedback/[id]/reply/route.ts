import { db } from "@/lib/db";
import { feedback, feedbackReplies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";

// POST /api/feedback/[id]/reply — admin reply (protected)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const feedbackId = parseInt(id);
    const { message, status } = await req.json();

    if (!message || message.trim().length < 2) {
      return NextResponse.json({ error: "Reply message is required." }, { status: 400 });
    }

    // Save the reply
    await db.insert(feedbackReplies).values({
      feedbackId,
      message: message.trim(),
      isAdmin: true,
      authorName: "DNvites Support",
    });

    // Update status if provided
    if (status) {
      await db.update(feedback).set({ status }).where(eq(feedback.id, feedbackId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback reply error:", err);
    return NextResponse.json({ error: "Failed to reply." }, { status: 500 });
  }
}

// PATCH /api/feedback/[id]/reply — update status only (admin)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status } = await req.json();

    await db.update(feedback).set({ status }).where(eq(feedback.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
