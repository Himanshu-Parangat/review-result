import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "@config";
import * as siteSchema from "@db/schema";
import { existsSync } from "fs";
import { genrateLog } from "@utils/loggingUtils";

let dbInitialized: boolean | null = null;

export function isDbInitialized() {
	if (dbInitialized !== null) {
		return dbInitialized;
	}

	if (!existsSync(config.dbPath)) {

		genrateLog()
			.time()
			.blue("[DB]")
			.red("Database does not exist at")
			.magenta(config.dbPath)
			.print()

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

			const missingTables = requiredTables.filter(
				t => !tableNames.includes(t)
			);

			genrateLog()
				.time()
				.blue("[DB]")
				.red("Database schema invalid")
				.yellow("Missing tables:")
				.magenta(missingTables.join(", "))
				.cyan("Found:")
				.green(tableNames.join(", "))
				.print();

			dbInitialized = false;
			return false;
		}

		dbInitialized = true;
		return true;
	} catch (error) {
		genrateLog()
			.time()
			.red("Error checking database schema:")
			.print()

		console.log(error)

		dbInitialized = false;
		return false;
	} finally {
		if (sqlite) {
			sqlite.close();
		}
	}
}


export function resetDbInitCheck() {
	dbInitialized = null;
}


export function initDb() {
	if (!isDbInitialized()) {

		const sqlite = new Database(config.dbPath);
		const db = drizzle(sqlite, { schema: siteSchema });

		migrate(db, {
			migrationsFolder: config.dbMigration, 
		});

		sqlite.close();

		genrateLog()
			.time()
			.blue("[DB]")
			.cyan("initialized new")
			.green("Database")
			.cyan("from ")
			.magenta(config.dbPath)
			.cyan("successfully")
			.print()

		resetDbInitCheck()
	}
}


let db: BetterSQLite3Database<typeof siteSchema> | null = null;
let sqlite: Database.Database | null = null;

export function getDb():  BetterSQLite3Database<typeof siteSchema> {
	if (!isDbInitialized()) {
		throw new Error(
			"Database not initialized. Call initDb() first or check database file exists."
		);
	}

	if (db === null) {
		genrateLog()
			.time()
			.yellow("[DB]")
			.cyan("Opening")
			.green("Database connection")
			.cyan("from ")
			.magenta(config.dbPath)
			.print()

		sqlite = new Database(config.dbPath);
		db = drizzle(sqlite, { schema: siteSchema });
	}

	return db;
}

export { siteSchema };
