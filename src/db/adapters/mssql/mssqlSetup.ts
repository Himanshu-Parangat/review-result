import { config } from "@src/config";
import { safe } from "@src/shared/errorHelper";
import { drizzleLogger } from "@src/shared/logger";
import { drizzle } from "drizzle-orm/node-mssql";
import { migrate } from "drizzle-orm/node-mssql/migrator";
import mssql from "mssql";

const mssqlConnectionConfig = {
	server: config.mssqlHost,
	port: config.mssqlPort,
	user: config.mssqlUser,
	password: config.mssqlPassword,
	database: config.mssqlDatabase,
	options: {
		encrypt: config.mssqlEncrypt,
		trustServerCertificate: config.mssqlTrustServerCertificate,
	},
} as const satisfies mssql.config;

async function setupMssqlConnstion() {
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

	const mssqlDb = drizzle({ client: pool, logger: drizzleLogger });

	await migrate(mssqlDb, { migrationsFolder: config.mssqlMigrationPath });

	return mssqlDb;
}

const mssqlSetup = await safe(setupMssqlConnstion);

if (!mssqlSetup.success) {
	throw new Error("Mssql Setup failed!", { cause: mssqlSetup.error });
}

const mssqlDb = mssqlSetup.data;

export { mssqlConnectionConfig, mssqlDb };
