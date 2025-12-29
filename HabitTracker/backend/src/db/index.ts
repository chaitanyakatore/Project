import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

// Disable "prefetch" because Supabase Transaction pooler doesn't support it
const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client, { schema });
