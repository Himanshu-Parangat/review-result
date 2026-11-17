import { config } from "@src/config";
import type mssql from "mssql";

const mssqlConnectionConfig = {
	server: config.mssqlHost,
	port: config.mssqlPort,
	user: config.mssqlUser,
	password: config.mssqlPassword,
	database: config.mssqlDatabase,
	options: {
		encrypt: config.mssqlEncrypt,
		trustServerCertificate: config.mssqlTrustServerCertificate,
	},
} as const satisfies mssql.config;

export { mssqlConnectionConfig };
