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
async function run() {
  console.log('Running ALTER TABLE...');
  const res1 = await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS our_story TEXT`;
  console.log('our_story res:', res1);
  const res2 = await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS map_url TEXT`;
  console.log('map_url res:', res2);
  
  const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'invitations'`;
  console.log('Columns now:', columns.map(c => c.column_name));
}
run().catch(console.error);
