import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "@config";
import * as siteSchema from "@db/schema";

let db: ReturnType<typeof drizzle> | null = null;

export function isDbInitialized() {
	return db !== null;
}


export function initDb() {
	if (!db) {
		const sqlite = new Database(config.dbPath);
		db = drizzle(sqlite, { schema: siteSchema });

		migrate(db, {
			migrationsFolder: config.dbMigration, 
		});

		console.log('✅ Database initialized successfully!');
	}
}

export function getDb() {
	if (!db) throw new Error("DB not initialized!");
	// if (!db) console.log("DB not initialized!");
	return db;
} 

export { siteSchema, db };
