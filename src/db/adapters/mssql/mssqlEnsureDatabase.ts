import { config } from "@src/config";
import { mssqlConnectionConfig } from "@src/db/adapters/mssql/mssqlConnection";
import { safe } from "@src/shared/errorHelper";
import { drizzleLogger, logger } from "@src/shared/logger";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-mssql";
import mssql from "mssql";

const ensureDbSql = `IF DB_ID('${mssqlConnectionConfig.database}') IS NULL CREATE DATABASE [${mssqlConnectionConfig.database}];`;

function printCommand() {
	const { server, port, user, database } = mssqlConnectionConfig;

	const message = `Create the "${database}" database for the application

Run this with sqlcmd (the login needs CREATE DATABASE permission on "master").
You will be prompted for the password:

  sqlcmd -S "${server},${port}" -U "${user}" -d master -C -Q "${ensureDbSql}"

If "sqlcmd" is not found, it may not be on your PATH. Try the full path:

  /opt/mssql-tools18/bin/sqlcmd
  /opt/mssql-tools/bin/sqlcmd

If sqlcmd is not installed, run this SQL in any SQL client instead
(connected to "master"):

  ${ensureDbSql}
`;

	logger.info(message);
}

async function ensureDatabase() {
	const pool = new mssql.ConnectionPool({
		...mssqlConnectionConfig,
		password: Bun.env["MSSQL_MASTER_PASSWORD"] ?? mssqlConnectionConfig.password,
		database: "master",
	});

	const dbSetup = await safe(async () => {
		await pool.connect();
		const db = drizzle({ client: pool, logger: drizzleLogger });
		await db.execute(sql.raw(ensureDbSql));
	});

	const dbClosed = await safe(pool.close());

	if (!dbClosed.success) {
		logger.warn({ err: dbClosed.error }, "Failed to close MSSQL master pool");
	}

	if (!dbSetup.success) {
		logger.error({ err: dbSetup.error, db: config.mssqlDatabase }, "MSSQL precondition failed");
		throw new Error(
			`MSSQL precondition failed for ${config.mssqlDatabase} DB creation: ${dbSetup.error}`,
			{
				cause: dbSetup.error,
			},
		);
	}

	logger.info({ db: config.mssqlDatabase }, "MSSQL database ensured");
}

if (Bun.argv.includes("--print")) {
	printCommand();
} else {
	await ensureDatabase();
}
