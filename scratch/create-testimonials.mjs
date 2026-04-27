import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  const val = trimmed.slice(eq + 1).trim()
  process.env[key] = val
}

const sql = neon(process.env.DATABASE_URL)

async function create() {
  console.log('Creating testimonials table...')
  try {
    await sql`
      CREATE TABLE testimonials (
        id            SERIAL PRIMARY KEY,
        name          TEXT         NOT NULL,
        email         TEXT         NOT NULL,
        rating        INTEGER      NOT NULL DEFAULT 5,
        message       TEXT         NOT NULL,
        is_public     BOOLEAN      NOT NULL DEFAULT FALSE,
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `
    console.log('✅ Table created!')
  } catch (err) {
    console.error('❌ Failed:', err.message)
  }
}

create()
