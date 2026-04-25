import { readFileSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf8");
let dbUrl = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=")[1].trim();
    break;
  }
}

if (!dbUrl) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const sql = neon(dbUrl);

async function run() {
  console.log("Checking tables...");
  const tables = await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
  console.log("Current tables:", tables.map(t => t.tablename));

  console.log("Creating feedback tables manually...");
  try {
    await sql`
      CREATE TABLE feedback (
        id            SERIAL PRIMARY KEY,
        name          TEXT         NOT NULL,
        email         TEXT         NOT NULL,
        type          TEXT         NOT NULL DEFAULT 'feedback',
        subject       TEXT         NOT NULL,
        message       TEXT         NOT NULL,
        status        TEXT         NOT NULL DEFAULT 'open',
        is_public     BOOLEAN      NOT NULL DEFAULT TRUE,
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    console.log("Table 'feedback' created.");
  } catch (e) {
    console.log("Table 'feedback' error:", e.message);
  }

  try {
    await sql`
      CREATE TABLE feedback_replies (
        id            SERIAL PRIMARY KEY,
        feedback_id   INTEGER      NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
        message       TEXT         NOT NULL,
        is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
        author_name   TEXT         NOT NULL DEFAULT 'DNvites Support',
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    console.log("Table 'feedback_replies' created.");
  } catch (e) {
    console.log("Table 'feedback_replies' error:", e.message);
  }
}

run();
