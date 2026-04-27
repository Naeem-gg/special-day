import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  console.log("Updating OTP tracking columns in 'users' table...")
  try {
    // Drop old columns if they exist from previous attempt
    await sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "otp_resend_count";`
    await sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "last_otp_resend_at";`

    // Add new columns
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp_count_today" integer DEFAULT 0 NOT NULL;`
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_otp_at" timestamp;`
    console.log("Successfully updated 'users' table.")
  } catch (err) {
    console.error("Failed to update 'users' table:", err.message)
  }
}

run()
