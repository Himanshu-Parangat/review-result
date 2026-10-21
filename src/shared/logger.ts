// biome-ignore lint/correctness/noNodejsModules: running on Bun
import path from "node:path";
import { config } from "@src/config";
import { generateLabel } from "@src/shared/generator";
import pino from "pino";

const filenameSemantic = generateLabel(`${config.name}-${config.version}-${config.env}`, "label");

function prepareFileTransport() {
	return {
		target: "pino-roll",
		level: config.logLevel,
		options: {
			file: path.join(config.logFilePath, filenameSemantic),
			extension: ".log",
			dateFormat: "yyyy-MM-dd_HH-mm-ss",
			frequency: "daily",
			size: config.logFileMaxSize,
			limit: { count: config.logFileMaxFiles },
			mkdir: true,
		},
	} as const satisfies pino.TransportTargetOptions;
}

function prepareJsonStdoutTransport() {
	return {
		target: "pino/file",
		level: config.logLevel,
		options: { destination: 1 },
	} as const satisfies pino.TransportTargetOptions;
}

function preparePrettyStdoutTransport() {
	return {
		target: "pino-pretty",
		level: config.logLevel,
		options: {
			colorize: true,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
		},
	} as const satisfies pino.TransportTargetOptions;
}

function prepareBaseLoggerOptions() {
	return {
		level: config.logLevel,
    levelComparison: "ASC",
		base: {
			app: config.name,
			env: config.env,
			version: config.version,
		},
		timestamp: pino.stdTimeFunctions.isoTime,
		redact: {
			paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.token"],
			censor: "[REDACTED]",
		},
	} as const satisfies pino.LoggerOptions;
}

function prepareSilentLogger() {
	return { level: "silent" } as const satisfies pino.LoggerOptions;
}

function prepareLogger(): pino.LoggerOptions {
	if (config.logLevel === "silent") {
		return prepareSilentLogger();
	}

	const targets: pino.TransportTargetOptions[] = [];

	if (config.logFileEnabled) {
		targets.push(prepareFileTransport());
	}

	if (config.logStdoutEnabled && config.logStdoutFormat === "pretty") {
		targets.push(preparePrettyStdoutTransport());
	}

	if (config.logStdoutEnabled && config.logStdoutFormat === "json") {
		targets.push(prepareJsonStdoutTransport());
	}

	if (targets.length === 0) {
		return prepareSilentLogger();
	}

	return {
		...prepareBaseLoggerOptions(),
		transport: { targets },
	};
}

const logger = pino(prepareLogger());

export { logger };
