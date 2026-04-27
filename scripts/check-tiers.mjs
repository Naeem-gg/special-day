import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    const tiers = await sql`SELECT * FROM tiers`
    console.log('Tiers in DB:')
    console.table(tiers)
  } catch (err) {
    console.error('Failed to fetch tiers:', err)
  }
}

run()
