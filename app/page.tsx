import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import HomeClient from '@/components/HomeClient'
import { getUserSession } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let publicTestimonials: any[] = []
  let session = null

  try {
    ;[publicTestimonials, session] = await Promise.all([
      db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isPublic, true))
        .orderBy(desc(testimonials.createdAt)),
      getUserSession(),
    ])
  } catch (err) {
    console.error('Home: Failed to fetch initial data:', err)
  }

  return <HomeClient testimonials={publicTestimonials} session={session} />
}
