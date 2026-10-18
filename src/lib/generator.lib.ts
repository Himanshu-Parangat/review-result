import type { ValidConstraints } from "@src/schema/types";
import { customAlphabet } from "nanoid";

const generatorConstraints = {
  id: {
    // biome-ignore lint/security/noSecrets: Not a secret, meant for nanoid custom alphabet
    allowedCharacter: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    exactValue: 25,
  },

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

const nanoid = customAlphabet(generatorConstraints.id.allowedCharacter);

function generateId(idLength: number = generatorConstraints.id.exactValue) {
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
