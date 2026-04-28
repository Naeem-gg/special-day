import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const envPath = resolve(projectRoot, '.env.local');
const envContent = readFileSync(envPath, 'utf8');

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim();
  process.env[key] = val;
}

const sql = neon(process.env.DATABASE_URL);
async function testQuery() {
  try {
    // Correct way to use tagged template with neon serverless
    const res = await sql`select "id", "slug", "bride_name", "groom_name", "user_email", "date", "venue", "events", "gallery", "music_url", "background_image", "tier", "template", "coupon_id", "discount_applied", "paid_amount", "razorpay_order_id", "razorpay_payment_id", "views", "language", "our_story", "map_url", "created_at" from "invitations" order by "invitations"."created_at" desc`;
    console.log('Query succeeded! Rows count:', res.length);
  } catch (err) {
    console.error('Query failed!');
    console.error(err);
  }
}
testQuery().catch(console.error);
