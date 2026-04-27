import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    // 1. Get all invitations for this user (or just all invitations to see if any are missing userEmail)
    const invs = await sql`SELECT id, slug, user_email, bride_name, groom_name FROM invitations`
    console.log('All Invitations:')
    console.table(invs)

    // 2. Get all RSVPs
    const rsvps = await sql`SELECT id, invitation_id, name, guests, attending FROM rsvps`
    console.log('\nAll RSVPs:')
    console.table(rsvps)
  } catch (err) {
    console.error('Debug failed:', err)
  }
}

run()
