import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  console.log("Adding OTP resend columns to 'users' table...")
  try {
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp_resend_count" integer DEFAULT 0 NOT NULL;`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_otp_resend_at" timestamp;`
    console.log("Successfully updated 'users' table.")
  } catch (err) {
    console.error("Failed to update 'users' table:", err.message)
  }
}

run()
