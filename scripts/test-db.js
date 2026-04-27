const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
  console.log('Testing connection to:', process.env.DATABASE_URL?.split('@')[1] || 'URL not found')

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('Attempting to connect...')
    await client.connect()
    console.log('Successfully connected!')
    const res = await client.query('SELECT NOW()')
    console.log('Query result:', res.rows[0])
    await client.end()
  } catch (err) {
    console.error('Connection failed:', err.message)
    if (err.stack) console.error(err.stack)
    process.exit(1)
  }
}

testConnection()
