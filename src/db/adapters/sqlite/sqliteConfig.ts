import { config } from "@src/config";
import { resolveSqliteDatabasePath } from "@src/db/adapters/sqlite/sqliteConnection";
import { ensureWritableDirectory } from "@src/shared/filesystem";
import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: Required by Drizzle-kit
export default defineConfig({
	schema: "src/db/adapters/sqlite/sqliteSchema.ts",
	out: ensureWritableDirectory(config.sqliteMigrationPath),
	dialect: "sqlite",
	dbCredentials: { url: resolveSqliteDatabasePath() },
	verbose: true,
});
