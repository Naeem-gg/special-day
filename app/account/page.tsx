import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { invitations, testimonials } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import { DashboardClient } from './DashboardClient'

export default async function AccountPage() {
  const session = await getUserSession()

  if (!session?.email) {
    redirect('/login')
  }

  const userInvitations = await db.query.invitations.findMany({
    where: sql`lower(${invitations.userEmail}) = ${String(session.email).toLowerCase()}`,
    orderBy: [desc(invitations.createdAt)],
  })

  const existingTestimonial = await db.query.testimonials.findFirst({
    where: sql`lower(${testimonials.email}) = ${String(session.email).toLowerCase()}`,
  })

  return (
    <DashboardClient
      email={session.email}
      invitations={userInvitations}
      hasReviewed={!!existingTestimonial}
    />
  )
}
