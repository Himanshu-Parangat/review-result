import { z } from "@hono/zod-openapi";
import type { ValidConstraints } from "@src/shared/types";

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const LOG_FILE_SIZE_REGEX = /^[1-9]\d*[kmg]$/i;

const isPowerOfTwo = (n: number) => n > 0 && Number.isInteger(Math.log2(n));

const configConstraints = {
	env: {
		allowedLiteralValue: ["development", "production"],
	},
	port: {
		minValue: 1,
		maxValue: 65_535,
	},
	name: {
		minValue: 4,
		maxValue: 255,
	},
	description: {
		minValue: 4,
		maxValue: 455,
	},

	dbMode: {
		allowedLiteralValue: ["memory", "sqlite"],
	},

	sqliteJournalModes: {
		allowedLiteralValue: ["delete", "truncate", "persist", "memory", "wal", "off"],
	},

	sqliteSynchronousModes: {
		allowedLiteralValue: ["off", "normal", "full", "extra"],
	},

	sqliteBusyTimeoutMs: {
		minValue: 0,
		maxValue: 60_000,
		defaultNumberValue: 5000,
	},

	sqliteCacheSizeMb: {
		minValue: 0,
		maxValue: 1024,
		defaultNumberValue: 64,
	},

	sqlitePageSize: {
		minValue: 512,
		maxValue: 65_536,
		defaultNumberValue: 4096,
	},

	logLevel: {
		allowedLiteralValue: ["silent", "info", "warn", "error", "debug", "trace", "fatal"],
	},

	logFormat: {
		allowedLiteralValue: ["json", "pretty"],
	},

	logFileMaxFiles: {
		minValue: 1,
		maxValue: 365,
	},
} as const satisfies Record<string, ValidConstraints>;

const hostSchema = z.union([z.hostname(), z.ipv4(), z.ipv6()]);

const portSchema = z.coerce
	.number()
	.int()
	.min(configConstraints.port.minValue)
	.max(configConstraints.port.maxValue);

const configSchema = z.object({
	env: z.enum(configConstraints.env.allowedLiteralValue),

	serverBindHost: hostSchema,
	serverPort: portSchema,

	name: z.string().min(configConstraints.name.minValue).max(configConstraints.name.maxValue),
	description: z
		.string()
		.min(configConstraints.description.minValue)
		.max(configConstraints.description.maxValue),

	version: z.string().regex(SEMVER_REGEX, "version must be valid semver"),

	dbMode: z.enum(configConstraints.dbMode.allowedLiteralValue),

	sqliteDbPath: z.string().trim().min(1).default("src/db/store/store.db"),

	sqliteJournalModes: z.enum(configConstraints.sqliteJournalModes.allowedLiteralValue),

	sqliteSynchronousModes: z.enum(configConstraints.sqliteSynchronousModes.allowedLiteralValue),

	sqliteBusyTimeoutMs: z.coerce
		.number()
		.int()
		.min(configConstraints.sqliteBusyTimeoutMs.minValue)
		.max(configConstraints.sqliteBusyTimeoutMs.maxValue)
		.default(configConstraints.sqliteBusyTimeoutMs.defaultNumberValue),

	sqliteCacheSizeMb: z.coerce
		.number()
		.int()
		.min(configConstraints.sqliteCacheSizeMb.minValue)
		.max(configConstraints.sqliteCacheSizeMb.maxValue)
		.default(configConstraints.sqliteCacheSizeMb.defaultNumberValue),

	sqlitePageSize: z.coerce
		.number()
		.int()
		.min(configConstraints.sqlitePageSize.minValue)
		.max(configConstraints.sqlitePageSize.maxValue)
		.refine(isPowerOfTwo, "sqlitePageSize must be a power of two between 512–65536")
		.default(configConstraints.sqlitePageSize.defaultNumberValue),

	logLevel: z.enum(configConstraints.logLevel.allowedLiteralValue),

	logStdoutEnabled: z.stringbool(),

	logStdoutFormat: z.enum(configConstraints.logFormat.allowedLiteralValue),

	logFileEnabled: z.stringbool(),

	logFileMaxSize: z
		.string()
		.trim()
		.regex(LOG_FILE_SIZE_REGEX, 'Use a size like "500k", "10m" or "1g"'),

	logFileMaxFiles: z.coerce
		.number()
		.int()
		.min(configConstraints.logFileMaxFiles.minValue)
		.max(configConstraints.logFileMaxFiles.maxValue),

	logFilePath: z.string().trim().min(1).default("./log/app"),
});

type Config = z.infer<typeof configSchema>;

export { type Config, configSchema };
