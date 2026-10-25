import type { ValidConstraints } from "@src/shared/types";

const coreConstraints = {
	id: {
		exactValue: 25,
		allowedCharacter: "a-zA-Z0-9",
	},
	label: {
		minValue: 4,
		allowedCharacter: "a-zA-Z0-9_-",
	},
} as const satisfies Record<string, ValidConstraints>;

export { coreConstraints };
