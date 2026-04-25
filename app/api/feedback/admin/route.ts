import { db } from "@/lib/db";
import { feedback, feedbackReplies } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";

// GET /api/feedback/admin — full list for admin (all items, with replies)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await db.query.feedback.findMany({
      orderBy: [desc(feedback.createdAt)],
      with: {
        replies: {
          orderBy: [desc(feedbackReplies.createdAt)],
        },
      },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("Admin feedback list error:", err);
    return NextResponse.json({ error: "Failed to load feedback." }, { status: 500 });
  }
}
