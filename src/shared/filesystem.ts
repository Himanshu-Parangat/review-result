/** biome-ignore-all lint/correctness/noNodejsModules: Bun implements node:os, node:fs, node:path natively, and they’re a first-class part of the runtime. */
import { accessSync, constants, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

function expandUnixLinuxHome(filePath: string): string {
	if (filePath === "~") {
		return os.homedir();
	}
	if (filePath.startsWith("~/")) {
		return path.join(os.homedir(), filePath.slice(2));
	}
	return filePath;
}

function expandWindowsEnvs(filePath: string): string {
	return filePath.replace(/%(?<name>[^%\s]+)%/gu, (_match, name: string) => {
		const value = import.meta.env[name];

		if (value === undefined || value === "") {
			throw new Error(`Environment variable "${name}" is not set (from path: ${filePath})`);
		}

		return value;
	});
}

function resolvePath(filePath: string) {
	return path.resolve(expandWindowsEnvs(expandUnixLinuxHome(filePath)));
}

function ensureDirectoryIsWritable(directoryPath: string) {
	try {
		mkdirSync(directoryPath, { recursive: true });
		accessSync(directoryPath, constants.W_OK);
	} catch (error) {
		throw new Error(`Directory "${directoryPath}" is missing or not writable: ${error}`, {
			cause: error,
		});
	}
}

function ensureWritableDirectory(dirPath: string) {
	const resolvedDir = resolvePath(dirPath);
	ensureDirectoryIsWritable(resolvedDir);
	return resolvedDir;
}

function ensureWritableParentDirectory(filePath: string) {
	const resolvedFile = resolvePath(filePath);
	ensureDirectoryIsWritable(path.dirname(resolvedFile));
	return resolvedFile;
}

export { ensureWritableDirectory, ensureWritableParentDirectory };
