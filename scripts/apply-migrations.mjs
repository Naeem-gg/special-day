import postgres from 'postgres';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function run() {
  const connectionString = process.env.DATABASE_URL.replace('-pooler', '');
  const sql = postgres(connectionString, { ssl: 'require' });
  
  try {
    const migration1 = fs.readFileSync('drizzle/0001_natural_maverick.sql', 'utf8');
    const statements1 = migration1.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s);
    
    console.log("Applying 0001_natural_maverick.sql...");
    for (const stmt of statements1) {
      console.log(`Executing: ${stmt}`);
      try {
        await sql.unsafe(stmt);
      } catch (err) {
        console.warn(`Warning/Error on stmt: ${err.message}`);
      }
    }
    
    console.log("Migrations applied!");
  } catch (err) {
    console.error("Migration script failed:", err);
  } finally {
    await sql.end();
  }
}

run();
