import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim();
  process.env[key] = val;
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log("Current Tables:", tables.map(t => t.table_name).join(", "));
}

check();
