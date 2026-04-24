import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { invitations, testimonials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DashboardClient } from "./DashboardClient";

export default async function AccountPage() {
  const session = await getUserSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch invitations associated with this user's email
  const userInvitations = await db.query.invitations.findMany({
    where: eq(invitations.userEmail, session.email),
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  });

  // Check if user has already submitted a testimonial
  const existingTestimonial = await db.query.testimonials.findFirst({
    where: eq(testimonials.email, session.email),
  });

  return (
    <DashboardClient 
      email={session.email} 
      invitations={userInvitations} 
      hasReviewed={!!existingTestimonial}
    />
  );
}
