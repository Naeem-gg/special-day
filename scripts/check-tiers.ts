import { db } from '../lib/db'
import { tiers } from '../lib/db/schema'
async function main() {
  const data = await db.query.tiers.findMany()
  console.log(data)
  process.exit(0)
}
main()
