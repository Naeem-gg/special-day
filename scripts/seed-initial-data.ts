import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from '../lib/db/schema'
import * as dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config({ path: '.env.local' })

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function seed() {
  console.log('Connecting to database...')
  await client.connect()

  const db = drizzle(client, { schema })
  console.log('Seeding initial data...')

  try {
    // 1. Seed Tiers
    console.log('Seeding tiers...')
    const initialTiers = [
      { slug: 'basic', name: 'Bronze', price: 399 },
      { slug: 'standard', name: 'Silver', price: 799 },
      { slug: 'premium', name: 'Gold', price: 999 },
    ]

    for (const tier of initialTiers) {
      await db
        .insert(schema.tiers)
        .values(tier)
        .onConflictDoUpdate({
          target: schema.tiers.slug,
          set: { name: tier.name, price: tier.price },
        })
    }

    // 2. Seed Admin
    console.log('Seeding admin...')
    const adminUsername = 'admin'
    const adminPassword = 'password123' // User should change this
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await db
      .insert(schema.admins)
      .values({
        username: adminUsername,
        password: hashedPassword,
      })
      .onConflictDoNothing()

    // 3. Seed initial Coupon
    console.log('Seeding initial coupon...')
    await db
      .insert(schema.coupons)
      .values({
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        active: true,
      })
      .onConflictDoNothing()

    console.log('Initial data seeded successfully!')
  } catch (err) {
    console.error('Seeding failed in main loop:', err)
    throw err
  } finally {
    await client.end()
  }
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
