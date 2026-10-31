/** biome-ignore-all lint/correctness/noNodejsModules: Bun implements node:fs, node:path and the rest natively, and they’re a first-class part of the runtime. */
import { accessSync, constants, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { safeSync } from "@src/shared/errorHelper";

function ensureWritableParentDirectory(filePath: string) {
	const directory = dirname(filePath);

	const [error] = safeSync(() => {
		mkdirSync(directory, { recursive: true });
		accessSync(directory, constants.W_OK);
	});

	if (error !== null) {
		throw new Error(`Directory "${directory}" is missing or not writable`, { cause: error });
	}
}

export { ensureWritableParentDirectory };
