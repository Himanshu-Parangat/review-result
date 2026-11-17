import { config } from "@src/config";
import { ensureWritableParentDirectory } from "@src/shared/filesystem";

function resolveSqliteDatabasePath() {
	if (config.dbMode === "memory") {
		return ":memory:";
	}

	return ensureWritableParentDirectory(config.sqliteDbPath);
}

export { resolveSqliteDatabasePath };
