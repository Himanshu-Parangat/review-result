import packageJson from "@src/../package.json" with { type: "json" };
import { type Config, configSchema } from "@src/schema/schemaConfig";

const { env } = import.meta;

const rawConfig = {
	name: env["PACKAGE_NAME_OVERRIDE"] || packageJson.name,
	description: env["PACKAGE_DESCRIPTION_OVERRIDE"] || packageJson.description,
	version: env["PACKAGE_VERSION_OVERRIDE"] || packageJson.version,
	env: env.NODE_ENV,
	host: env["HOST"],
	port: env["PORT"],
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
