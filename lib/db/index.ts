import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Cache the database connection in development to prevent 
 * creating multiple pools during HMR (Hot Module Replacement).
 */
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 15000,
    ssl: {
      rejectUnauthorized: false, // Required for Neon in many local environments
    },
  });

console.log("[DB Debug] Initializing pool...");
pool.on('error', (err) => console.error('[DB Debug] Unexpected error on idle client', err));
pool.on('connect', () => console.log('[DB Debug] New client connected to pool'));

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
