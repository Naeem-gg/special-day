import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Use the 'postgres' package which handles Neon SSL correctly.
 * Cache the client in development to prevent multiple connections during HMR.
 */
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

const connectionString = process.env.DATABASE_URL!;

const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: "require",
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema });
