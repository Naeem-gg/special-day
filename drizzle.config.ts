import config from "dotenv"
config.config({path:".env.local"})
import { defineConfig } from "drizzle-kit";

//Configured for SQLite with Turso
export default defineConfig({
  dialect: "turso",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url:process.env.DATABASE_URL as string,
    authToken:process.env.DATABASE_AUTH_TOKEN as string,
  },
  strict: true,
  verbose: true,
});