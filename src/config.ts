import packageJson from "@src/../package.json" with { type: "json" };
import { configSchema } from "@src/schema/config.schema";

const { env } = import.meta;

const result = configSchema.safeParse({
	env: env.NODE_ENV,
	host: env["HOST"],
	port: env["PORT"],

	name: env["PACKAGE_NAME_OVERRIDE"] || packageJson.name,
	description: env["PACKAGE_DESCRIPTION_OVERRIDE"] || packageJson.description,
	version: env["PACKAGE_VERSION_OVERRIDE"] || packageJson.version,
});

if (!result.success) {
	const message = result.error.issues
		.map((issue) => `• ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");

	throw new Error(`Invalid environment configuration:\n${message}`);
}

export const config = result.data;
