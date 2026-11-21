import { config } from "@src/config";
import { mssqlConnectionConfig } from "@src/db/adapters/mssql/mssqlConnection";
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

	try {
		await pool.connect();

		const mssqlDb = drizzle({ client: pool, logger: drizzleLogger });

		await migrate(mssqlDb, {
			migrationsFolder: ensureWritableDirectory(config.mssqlMigrationPath),
		});

		return mssqlDb;
	} catch (error) {
		pool.close();
		throw new Error(`Mssql Setup failed! ${error}`, { cause: error });
	}
}

const mssqlDb = await setupMssqlConnection();

export { mssqlDb };
