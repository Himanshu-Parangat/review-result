import { coreConstraints } from "@src/schema/schemaCore";
import type { ValidConstraints } from "@src/shared/types";
import { customAlphabet } from "nanoid";

const generatorConstraints = {
	labelShard: {
		exactValue: 6,
	},

	labelTimestampShard: {
		exactValue: 4,
	},

	timestampBase: {
		exactValue: 36,
	},
} as const satisfies Record<string, ValidConstraints>;

// biome-ignore lint/security/noSecrets: Not a secret, meant for nanoid custom alphabet
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

function generateId(idLength: number = coreConstraints.id.exactValue) {
	return nanoid(Math.max(1, idLength));
}

function generateLabel(
	generateLabelFrom = "label",
	labelMode: "label" | "label-shard" | "label-timestamp-shard" = "label-shard",
) {
	const label = generateLabelFrom
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();

	switch (labelMode) {
		case "label":
			return label;
		case "label-shard": {
			const shard = generateId(generatorConstraints.labelShard.exactValue);
			return `${label}-${shard}`;
		}
		case "label-timestamp-shard": {
			const shard = generateId(generatorConstraints.labelTimestampShard.exactValue);
			const timestamp = Date.now().toString(generatorConstraints.timestampBase.exactValue);
			return `${label}-${timestamp}-${shard}`;
		}
		default: {
			const _exhaustive: never = labelMode;
			throw new Error(`Unhandled label mode: ${String(_exhaustive)}`);
		}
	}
}

export { generateId, generateLabel };
