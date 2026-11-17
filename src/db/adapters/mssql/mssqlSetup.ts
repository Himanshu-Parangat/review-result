import { config } from "@src/config";
import { mssqlConnectionConfig } from "@src/db/adapters/mssql/mssqlConnection";
import { safe } from "@src/shared/errorHelper";
import { ensureWritableDirectory } from "@src/shared/filesystem";
import { drizzleLogger } from "@src/shared/logger";
import { drizzle } from "drizzle-orm/node-mssql";
import { migrate } from "drizzle-orm/node-mssql/migrator";
import mssql from "mssql";

async function setupMssqlConnection() {
	const pool = new mssql.ConnectionPool({
		...mssqlConnectionConfig,
		connectionTimeout: config.mssqlConnectionTimeoutMs,
		requestTimeout: config.mssqlRequestTimeoutMs,
		options: {
			...mssqlConnectionConfig.options,
			appName: config.name,
		},
		pool: { min: 1, max: 1 },
	});

	await pool.connect();

	const mssqlDb = drizzle({ client: pool, logger: drizzleLogger });

	await migrate(mssqlDb, { migrationsFolder: ensureWritableDirectory(config.mssqlMigrationPath) });

	return mssqlDb;
}

const mssqlSetup = await safe(setupMssqlConnection);

if (!mssqlSetup.success) {
	throw new Error(`Mssql Setup failed! ${mssqlSetup.error} `, { cause: mssqlSetup.error });
}

const mssqlDb = mssqlSetup.data;

export { mssqlDb };
