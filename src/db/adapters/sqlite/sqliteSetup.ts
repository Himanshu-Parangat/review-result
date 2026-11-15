import { Database } from "bun:sqlite";
import { config } from "@src/config";
import { safeSync } from "@src/shared/errorHelper";
import { ensureWritableParentDirectory } from "@src/shared/filesystem";
import { drizzleLogger } from "@src/shared/logger";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const KIB_PER_MIB = 1024;

function buildSqliteConnectionString() {
	if (config.dbMode === "memory") {
		return ":memory:";
	}

	ensureWritableParentDirectory(config.sqliteDbPath);
	return config.sqliteDbPath;
}

function setupSqliteConnstion() {
	const sqlite = new Database(buildSqliteConnectionString(), { create: true, strict: true });

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

	migrate(sqliteDb, { migrationsFolder: config.sqliteMigrationPath });

	return sqliteDb;
}

const sqliteSetup = safeSync(setupSqliteConnstion);

if (!sqliteSetup.success) {
	throw new Error("Sqlite Setup failed!", { cause: sqliteSetup.error });
}

const sqliteDb = sqliteSetup.data;

export { buildSqliteConnectionString, sqliteDb };
