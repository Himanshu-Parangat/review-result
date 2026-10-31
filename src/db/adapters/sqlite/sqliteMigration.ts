import { buildSqliteConnectionString } from "@src/db/adapters/sqlite/sqliteSetup";
import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: Required by Drizzle
export default defineConfig({
	schema: "src/db/adapters/sqlite/sqliteSchema.ts",
	out: "./migrations/migrationsSqlite",
	dialect: "sqlite",
	dbCredentials: { url: buildSqliteConnectionString() },
	verbose: true,
});
