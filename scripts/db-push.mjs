/**
 * db-push.mjs
 *
 * A custom schema push script that uses the @neondatabase/serverless HTTP
 * driver instead of `pg`. This is required when port 5432 is blocked by
 * the ISP (common in India), which causes `drizzle-kit push` to hang.
 *
 * Usage:  node scripts/db-push.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

// ── 1. Load .env.local ─────────────────────────────────────────────────────
const envPath = resolve(projectRoot, '.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  const val = trimmed.slice(eq + 1).trim()
  if (!process.env[key]) process.env[key] = val
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in .env.local')
  process.exit(1)
}

// ── 2. Dynamically import runtime deps ─────────────────────────────────────
const require = createRequire(import.meta.url)

const { neon } = await import('@neondatabase/serverless')
const { drizzle } = await import('drizzle-orm/neon-http')

// Import schema using ts-node / tsx won't work here for .ts files directly,
// so we read the SQL we need to run manually.  A safer approach is to use
// drizzle-kit generate + run the SQL file. But we can also call the Neon
// HTTP endpoint directly with raw SQL introspection the same way drizzle-kit
// does, using the schema definition converted to SQL statements.

// ── 3. Connect via HTTP (port 443 — always open) ───────────────────────────
console.log('🔌  Connecting to Neon via HTTPS (port 443)…')
const sql = neon(DATABASE_URL)

// ── 4. Run a connectivity check ────────────────────────────────────────────
try {
  const result = await sql`SELECT current_database(), version()`
  console.log(`✅  Connected to: ${result[0].current_database}`)
  console.log(`    PG version:    ${result[0].version.split(' ').slice(0, 2).join(' ')}`)
} catch (err) {
  console.error('❌  Connection failed:', err.message)
  process.exit(1)
}

// ── 5. Apply schema DDL ─────────────────────────────────────────────────────
// We run each CREATE TABLE IF NOT EXISTS statement so this is idempotent.
// Add new columns as ALTER TABLE ... ADD COLUMN IF NOT EXISTS statements.

const statements = [
  /* ── admins ── */
  `CREATE TABLE IF NOT EXISTS admins (
    id            SERIAL PRIMARY KEY,
    username      TEXT   UNIQUE NOT NULL,
    password      TEXT          NOT NULL,
    reset_otp     TEXT,
    reset_otp_expires TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  )`,

  /* ── users ── */
  `CREATE TABLE IF NOT EXISTS users (
    id               SERIAL PRIMARY KEY,
    email            TEXT UNIQUE NOT NULL,
    password         TEXT,
    email_verified   BOOLEAN     NOT NULL DEFAULT FALSE,
    name             TEXT,
    login_otp        TEXT,
    login_otp_expires TIMESTAMPTZ,
    otp_count_today  INTEGER     NOT NULL DEFAULT 0,
    last_otp_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* ── tiers ── */
  `CREATE TABLE IF NOT EXISTS tiers (
    id         SERIAL PRIMARY KEY,
    slug       TEXT  UNIQUE NOT NULL,
    name       TEXT         NOT NULL,
    price      INTEGER      NOT NULL,
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )`,

  /* ── coupons ── */
  `CREATE TABLE IF NOT EXISTS coupons (
    id             SERIAL PRIMARY KEY,
    code           TEXT    UNIQUE NOT NULL,
    discount_type  TEXT           NOT NULL,
    discount_value INTEGER        NOT NULL,
    expires_at     TIMESTAMPTZ,
    usage_limit    INTEGER,
    used_count     INTEGER        NOT NULL DEFAULT 0,
    active         BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
  )`,

  /* ── invitations ── */
  `CREATE TABLE IF NOT EXISTS invitations (
    id                  SERIAL PRIMARY KEY,
    slug                TEXT UNIQUE NOT NULL,
    bride_name          TEXT        NOT NULL,
    groom_name          TEXT        NOT NULL,
    user_email          TEXT,
    date                TIMESTAMPTZ NOT NULL,
    venue               TEXT        NOT NULL,
    events              JSONB       NOT NULL DEFAULT '[]',
    gallery             JSONB       NOT NULL DEFAULT '[]',
    music_url           TEXT,
    background_image    TEXT,
    tier                TEXT        NOT NULL DEFAULT 'basic',
    template            TEXT        NOT NULL DEFAULT 'rose-gold',
    coupon_id           INTEGER     REFERENCES coupons(id),
    discount_applied    INTEGER     DEFAULT 0,
    paid_amount         INTEGER,
    razorpay_order_id   TEXT,
    razorpay_payment_id TEXT,
    views               INTEGER     NOT NULL DEFAULT 0,
    language            TEXT        NOT NULL DEFAULT 'en',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  /* ── rsvps ── */
  `CREATE TABLE IF NOT EXISTS rsvps (
    id            SERIAL PRIMARY KEY,
    invitation_id INTEGER      NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name          TEXT         NOT NULL,
    guests        INTEGER      NOT NULL DEFAULT 1,
    attending     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )`,

  /* ── testimonials ── */
  `CREATE TABLE IF NOT EXISTS testimonials (
    id            SERIAL PRIMARY KEY,
    name          TEXT         NOT NULL,
    email         TEXT         NOT NULL,
    rating        INTEGER      NOT NULL DEFAULT 5,
    message       TEXT         NOT NULL,
    is_public     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )`,

  /* ── feedback ── */
  `CREATE TABLE IF NOT EXISTS feedback (
    id            SERIAL PRIMARY KEY,
    name          TEXT         NOT NULL,
    email         TEXT         NOT NULL,
    type          TEXT         NOT NULL DEFAULT 'feedback',
    subject       TEXT         NOT NULL,
    message       TEXT         NOT NULL,
    status        TEXT         NOT NULL DEFAULT 'open',
    is_public     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )`,

  /* ── feedback_replies ── */
  `CREATE TABLE IF NOT EXISTS feedback_replies (
    id            SERIAL PRIMARY KEY,
    feedback_id   INTEGER      NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    message       TEXT         NOT NULL,
    is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
    author_name   TEXT         NOT NULL DEFAULT 'DNvites Support',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )`,
]

// New columns that may not exist yet (idempotent ALTER TABLE)
const alterStatements = [
  // Add any newly added columns here so re-runs are safe:
  // `ALTER TABLE invitations ADD COLUMN IF NOT EXISTS new_col TEXT`,
]

const allStatements = [...statements, ...alterStatements]

console.log(`\n🛠   Applying ${allStatements.length} DDL statement(s)…\n`)

let ok = 0
let failed = 0
for (const stmt of allStatements) {
  const label = stmt.trim().split('\n')[0].slice(0, 80)
  try {
    await sql.unsafe(stmt)
    console.log(`  ✅  ${label}`)
    ok++
  } catch (err) {
    // Already exists errors are fine; print others as warnings
    if (err.message?.includes('already exists')) {
      console.log(`  ℹ️   ${label}  (already exists, skipped)`)
      ok++
    } else {
      console.error(`  ❌  ${label}`)
      console.error(`      ${err.message}`)
      failed++
    }
  }
}

console.log(`\n${'─'.repeat(60)}`)
console.log(`Done. ${ok} succeeded, ${failed} failed.`)
if (failed > 0) process.exit(1)
