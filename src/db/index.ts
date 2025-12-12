import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "@config";
import * as siteSchema from "@db/schema";
import { existsSync } from "fs";

let db: ReturnType<typeof drizzle> | null = null;
let dbInitialized: boolean | null = null;

export function isDbInitialized() {
	if (dbInitialized !== null) {
		return dbInitialized;
	}

	if (!existsSync(config.dbPath)) {
		console.log("Database file does not exist");
		dbInitialized = false;
		return false;
	}

	let sqlite: Database.Database | null = null;
	try {
		sqlite = new Database(config.dbPath, { readonly: true });

		const tables = sqlite
			.prepare("SELECT name FROM sqlite_master WHERE type='table'")
			.all() as Array<{ name: string }>;

		const tableNames = tables.map(t => t.name);

		const requiredTables = [
			'dbIdentity', 'event', 'question', 'option',
			'participant', 'submission', 'response'
		];

		const allTablesExist = requiredTables.every(table => 
			tableNames.includes(table)
		);

		if (!allTablesExist) {
			console.log("Missing required tables. Found:", tableNames);
			dbInitialized = false;
			return false;
		}

		dbInitialized = true;
		return true;
	} catch (error) {
		console.log("Error checking database schema:", error);
		dbInitialized = false;
		return false;
	} finally {
		if (sqlite) {
			db = drizzle(sqlite, { schema: siteSchema });
		}
	}
}

// for check reset
export function resetDbInitCheck() {
	dbInitialized = null;
}


export function initDb() {
	if (!db) {
		const sqlite = new Database(config.dbPath);
		db = drizzle(sqlite, { schema: siteSchema });

		migrate(db, {
			migrationsFolder: config.dbMigration, 
		});

		console.log('✅ Database initialized successfully!');
		resetDbInitCheck()
	}
}

export function getDb() {
	if (!db) throw new Error("DB not initialized!");
	return db;
} 

export { siteSchema, db };
