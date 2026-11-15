import { config } from "@src/config";
import { mssqlConnectionConfig } from "@src/db/adapters/mssql/mssqlSetup";
import { safe } from "@src/shared/errorHelper";
import { ensureWritableParentDirectory } from "@src/shared/filesystem";
import { drizzleLogger, logger } from "@src/shared/logger";
import { defineConfig } from "drizzle-kit";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-mssql";
import mssql from "mssql";

async function setupDatabase() {
  ensureWritableParentDirectory(config.mssqlMigrationPath);

  const pool = new mssql.ConnectionPool({
    ...mssqlConnectionConfig,
    database: "master",
  });

  const dbSetup = await safe(async () => {
    await pool.connect();
    const db = drizzle({ client: pool, logger: drizzleLogger });
    await db.execute(
      sql.raw(
        `IF DB_ID('${config.mssqlDatabase}') IS NULL CREATE DATABASE [${config.mssqlDatabase}]`,
      ),
    );
  });

  const dbClosed = await safe(pool.close());

  if (!dbClosed.success) {
    logger.warn({ err: dbClosed.error }, "Failed to close MSSQL master pool");
  }

  if (!dbSetup.success) {
    logger.error({ err: dbSetup.error, db: config.mssqlDatabase }, "MSSQL precondition failed");
    throw new Error(`MSSQL precondition failed for ${config.mssqlDatabase} DB creation`, {
      cause: dbSetup.error,
    });
  }
}

await setupDatabase();

// biome-ignore lint/style/noDefaultExport: Required by Drizzle-kit
export default defineConfig({
  schema: "src/db/adapters/mssql/mssqlSchema.ts",
  out: config.mssqlMigrationPath,
  dialect: "mssql",
  dbCredentials: mssqlConnectionConfig,
  verbose: true,
});
