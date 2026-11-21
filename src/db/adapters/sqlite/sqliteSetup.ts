import { Database } from "bun:sqlite";
import { config } from "@src/config";
import { resolveSqliteDatabasePath } from "@src/db/adapters/sqlite/sqliteConnection";
import { ensureWritableDirectory } from "@src/shared/filesystem";
import { drizzleLogger } from "@src/shared/logger";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const KIB_PER_MIB = 1024;

function setupSqliteConnection() {
	const sqlite = new Database(resolveSqliteDatabasePath(), { create: true, strict: true });

	try {
		if (config.dbMode === "sqlite") {
			// Do not change the order page_size must come before journal_mode (WAL).
			sqlite.run(`PRAGMA page_size = ${config.sqlitePageSize};`);
			sqlite.run(`PRAGMA journal_mode = ${config.sqliteJournalModes.toUpperCase()};`);
			sqlite.run(`PRAGMA synchronous = ${config.sqliteSynchronousModes.toUpperCase()};`);
			sqlite.run(`PRAGMA busy_timeout = ${config.sqliteBusyTimeoutMs};`);
			sqlite.run(`PRAGMA cache_size = ${-config.sqliteCacheSizeMb * KIB_PER_MIB};`);
		}

		sqlite.run("PRAGMA foreign_keys = ON;");

		const sqliteDb = drizzle({ client: sqlite, logger: drizzleLogger });

		migrate(sqliteDb, { migrationsFolder: ensureWritableDirectory(config.sqliteMigrationPath) });

		return sqliteDb;
	} catch (error) {
		sqlite.close();
		throw new Error(`SQLite setup failed ${error}`, { cause: error });
	}
}

const sqliteDb = setupSqliteConnection();

export { sqliteDb };
