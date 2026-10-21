import { z } from "@hono/zod-openapi";
import type { ValidConstraints } from "@src/shared/types";

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const LOG_FILE_SIZE_REGEX = /^[1-9]\d*[kmg]$/i;

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

const configSchema = z.object({
	env: z.enum(configConstraints.env.allowedLiteralValue),
	host: z.union([z.hostname(), z.ipv4(), z.ipv6()]),
	port: z.coerce
		.number()
		.int()
		.min(configConstraints.port.minValue)
		.max(configConstraints.port.maxValue),

	name: z.string().min(configConstraints.name.minValue).max(configConstraints.name.maxValue),
	description: z
		.string()
		.min(configConstraints.description.minValue)
		.max(configConstraints.description.maxValue),

	version: z.string().regex(SEMVER_REGEX, "version must be valid semver"),

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
