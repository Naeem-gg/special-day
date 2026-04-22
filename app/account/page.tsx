import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
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

  return (
    <DashboardClient 
      email={session.email} 
      invitations={userInvitations} 
    />
  );
}
