/** biome-ignore-all lint/style/useNamingConvention: configSchema key should reflect actual env name */

import z from "zod";

const validPortRange = { min: 1, max: 65_535 };

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
	HOST: z.union([z.hostname(), z.ipv4(), z.ipv6()]),
	PORT: z.coerce.number().int().min(validPortRange.min).max(validPortRange.max),
});

// biome-ignore lint/style/noProcessEnv: reading application configuration
// biome-ignore lint/correctness/noProcessGlobal: Node.js runtime
const result = configSchema.safeParse(process.env);
if (!result.success) {
	const message = result.error.issues.map((i) => `• ${i.path.join(".")}: ${i.message}`).join("\n");

	throw new Error(`Invalid environment configuration:\n${message}`);
}

export const env = result.data;
