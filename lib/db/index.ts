import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
console.log("🛢️ Connecting to DB host:", connectionString.split("@")[1]?.split("/")[0]);

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

