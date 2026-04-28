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
async function check() {
  const res1 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'testimonials'`;
  console.log('testimonials:', res1.map(r => r.column_name));
  
  const res2 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'coupons'`;
  console.log('coupons:', res2.map(r => r.column_name));
  
  const res3 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tiers'`;
  console.log('tiers:', res3.map(r => r.column_name));
  
  const res4 = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'rsvps'`;
  console.log('rsvps:', res4.map(r => r.column_name));
}
check().catch(console.error);
