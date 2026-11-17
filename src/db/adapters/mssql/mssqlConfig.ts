import { config } from "@src/config";
import { mssqlConnectionConfig } from "@src/db/adapters/mssql/mssqlConnection";
import { ensureWritableDirectory } from "@src/shared/filesystem";
import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: Required by Drizzle-kit
export default defineConfig({
	schema: "src/db/adapters/mssql/mssqlSchema.ts",
	out: ensureWritableDirectory(config.mssqlMigrationPath),
	dialect: "mssql",
	dbCredentials: mssqlConnectionConfig,
	verbose: true,
});
