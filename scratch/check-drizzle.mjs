import { db } from "../lib/db/index";
import { testimonials } from "../lib/db/schema";
import { sql } from "drizzle-orm";

async function check() {
  try {
    console.log("Checking testimonials table with app's DB instance...");
    const result = await db.execute(sql`SELECT count(*) FROM testimonials`);
    console.log("✅ Table exists. Count:", result);
  } catch (err) {
    console.error("❌ Table NOT found:", err.message);
  }
}

check();
