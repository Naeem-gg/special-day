import { db } from "@/lib/db";
import { feedback, feedbackReplies } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import FeedbackClient from "./FeedbackClient";

// Force dynamic rendering to ensure fresh data on every visit
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Help & Feedback | DNvites",
  description: "Share your thoughts, report issues, or suggest new features for DNvites.",
};

async function getFeedbackThreads() {
  try {
    const items = await db.query.feedback.findMany({
      where: eq(feedback.isPublic, true),
      orderBy: [desc(feedback.createdAt)],
      with: {
        replies: {
          orderBy: [desc(feedbackReplies.createdAt)],
        },
      },
    });
    
    // Serialize dates for client component
    return items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      replies: item.replies.map(reply => ({
        ...reply,
        createdAt: reply.createdAt.toISOString()
      }))
    }));
  } catch (err) {
    console.error("Failed to fetch feedback threads:", err);
    return [];
  }
}

export default async function FeedbackPage() {
  const initialThreads = await getFeedbackThreads();

  return <FeedbackClient initialThreads={initialThreads} />;
}
