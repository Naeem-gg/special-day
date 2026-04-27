import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

async function test() {
  try {
    const result = await sql`SELECT * FROM testimonials LIMIT 1`
    console.log('✅ Query successful!')
  } catch (err) {
    console.error('❌ Query failed:', err.message)
  }
}

test()
