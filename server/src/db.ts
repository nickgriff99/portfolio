import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render Postgres requires SSL; rejectUnauthorized:false since Render's
  // certs aren't in Node's default trust store.
  ssl: { rejectUnauthorized: false },
});
