import type { ValidConstraints } from "@src/schema/types";
import z from "zod";

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

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
});

type Config = z.infer<typeof configSchema>;

export { type Config, configSchema };
