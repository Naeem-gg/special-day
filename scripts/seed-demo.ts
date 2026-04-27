import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

async function seed() {
  console.log('Seeding demo invitation...')

  // Check if demo already exists
  const existing = await db.query.invitations.findFirst({
    where: eq(schema.invitations.slug, 'demo'),
  })

  if (existing) {
    console.log('Demo invitation already exists. Skipping.')
    process.exit(0)
  }

  const demoDate = new Date()
  demoDate.setMonth(demoDate.getMonth() + 6) // 6 months from now

  await db.insert(schema.invitations).values({
    slug: 'demo',
    brideName: 'Ayesha',
    groomName: 'Abdullah',
    date: demoDate,
    venue: 'The Grand Rose Ballroom, New York, NY',
    events: [
      {
        name: 'Welcome Dinner',
        time: '6:00 PM',
        location: 'Hotel Garden Terrace',
        description: 'Join us for an evening of cocktails and conversation before the big day.',
      },
      {
        name: 'Wedding Ceremony',
        time: '4:00 PM',
        location: "St. Patrick's Cathedral",
        description: 'The exchange of vows and the beginning of our forever.',
      },
      {
        name: 'Main Reception',
        time: '7:00 PM',
        location: 'Grand Ballroom',
        description: 'A night of celebration, dining, and dancing under the stars.',
      },
    ],
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
        publicId: 'demo-1',
      },
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
        publicId: 'demo-2',
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
        publicId: 'demo-3',
      },
    ],
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/images/hero-bg.png',
  })

  console.log('Demo invitation seeded successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
