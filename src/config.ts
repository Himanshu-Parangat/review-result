import packageJson from "@src/../package.json" with { type: "json" };
import { type Config, configSchema } from "@src/schema/schemaConfig";

const { env } = import.meta;

const rawConfig = {
	name: env["PACKAGE_NAME_OVERRIDE"] || packageJson.name,
	description: env["PACKAGE_DESCRIPTION_OVERRIDE"] || packageJson.description,
	version: env["PACKAGE_VERSION_OVERRIDE"] || packageJson.version,
	env: env.NODE_ENV,
	serverBindHost: env["SERVER_BIND_HOST"],
	serverPort: env["SERVER_PORT"],

	valkeyEnabled: env["VALKEY_ENABLED"],
	valkeyHost: env["VALKEY_HOST"],
	valkeyPort: env["VALKEY_PORT"],
	valkeyUsername: env["VALKEY_USERNAME"],
	valkeyPassword: env["VALKEY_PASSWORD"],
	valkeyDb: env["VALKEY_DB"],
	valkeyTls: env["VALKEY_TLS"],

	dbMode: env["DB_MODE"],

	sqliteDbPath: env["SQLITE_DB_PATH"],
	sqliteJournalModes: env["SQLITE_JOURNAL_MODES"],
	sqliteSynchronousModes: env["SQLITE_SYNCHRONOUS_MODES"],
	sqliteBusyTimeoutMs: env["SQLITE_BUSY_TIMEOUT_MS"],
	sqliteCacheSizeMb: env["SQLITE_CACHE_SIZE_MB"],
	sqlitePageSize: env["SQLITE_PAGE_SIZE"],
	sqliteMigrationPath: env["SQLITE_MIGRATION_PATH"],

	mssqlHost: env["MSSQL_HOST"],
	mssqlPort: env["MSSQL_PORT"],
	mssqlUser: env["MSSQL_USER"],
	mssqlPassword: env["MSSQL_PASSWORD"],
	mssqlDatabase: env["MSSQL_DB_USE"],
	mssqlEncrypt: env["MSSQL_ENCRYPT_STATUS"],
	mssqlTrustServerCertificate: env["MSSQL_TRUSTED_SERVER"],
	mssqlConnectionTimeoutMs: env["MSSQL_CONNECTION_TIMEOUT_MS"],
	mssqlRequestTimeoutMs: env["MSSQL_REQUEST_TIMEOUT_MS"],
	mssqlMigrationPath: env["MSSQL_MIGRATION_PATH"],

	logLevel: env["LOG_LEVEL"],
	logStdoutEnabled: env["LOG_STDOUT_ENABLED"],
	logStdoutFormat: env["LOG_STDOUT_FORMAT"],
	logFileEnabled: env["LOG_FILE_ENABLED"],
	logFileMaxSize: env["LOG_FILE_MAX_SIZE"],
	logFileMaxFiles: env["LOG_FILE_MAX_FILES"],
	logFilePath: env["LOG_FILE_PATH"],
} as const satisfies Record<keyof Config, string | undefined>;

const result = configSchema.safeParse(rawConfig);

if (!result.success) {
	const message = result.error.issues
		.map((issue) => `• ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");

	throw new Error(`Invalid environment configuration:\n${message}`);
}

export const config = result.data;
