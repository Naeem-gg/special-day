import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  console.log("Fixing 'users' table columns...")
  try {
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text;`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false NOT NULL;`
    console.log("Successfully added missing columns to 'users' table.")
  } catch (err) {
    console.error("Failed to fix 'users' table:", err.message)
  }
}

run()
