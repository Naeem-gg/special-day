import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const sql = neon(process.env.DATABASE_URL)

  try {
    const result = await sql`
      SELECT id, slug, bride_name, groom_name, user_email, date, venue, events, gallery, music_url, background_image, tier, template, coupon_id, discount_applied, paid_amount, razorpay_order_id, razorpay_payment_id, views, language, created_at 
      FROM invitations 
      ORDER BY created_at DESC;
    `
    console.log('Query successful, fetched', result.length, 'rows.')
  } catch (err) {
    console.error('Query failed with actual error:')
    console.error(err.message)
  }
}

run()
