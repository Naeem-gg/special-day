import { db } from '@/lib/db'
import { tiers } from '@/lib/db/schema'
import { getUserSession } from '@/lib/auth-utils'
import DashboardClient from './DashboardClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Your Wedding Invitation | DNvites',
  description:
    'Build your dream wedding invitation in minutes. Choose from premium templates and share it instantly.',
}

// Force dynamic rendering to ensure session and tiers are always fresh
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [allTiers, userSession] = await Promise.all([db.select().from(tiers), getUserSession()])

    return {
      allTiers,
      session: userSession ? { authenticated: true, user: userSession } : { authenticated: false },
    }
  } catch (err) {
    console.error('Dashboard: Failed to fetch initial data:', err)
    return {
      allTiers: [],
      session: { authenticated: false },
    }
  }
}

export default async function DashboardPage() {
  const { allTiers, session } = await getData()

  return <DashboardClient initialTiers={allTiers} initialSession={session} />
}
