import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as siteSchema from "@db/schema";

const sqlite = new Database("src/db/store.db");

export const db = drizzle(sqlite, { schema: siteSchema });

export { siteSchema };
