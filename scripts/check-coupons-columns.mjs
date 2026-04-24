import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'coupons';
    `;
    console.log("Current columns in coupons table:");
    console.log(columns.map(c => c.column_name).join(', '));
  } catch (err) {
    console.error("Failed to fetch columns:", err);
  }
}

run();
