import { dbIdentity } from "@db/schema";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { generateId } from "./MainUtils";

const dbLocation = "src/db/store.db";

const dbInit = new Database(dbLocation);
const db = drizzle(dbInit);


export async function SeedDefault() {
	const dbIdentityEntry = await db.select().from(dbIdentity).limit(1);

	if (dbIdentityEntry.length === 0) {

		const title = "Default db";
		const label = title
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, "")
			.trim()
			.replace(/\s+/g, "-");

		db.insert(dbIdentity).values({
			dbId: generateId(),
			dbTitle: title,
			dbDescription: "This is the default Db",
			dbLabel: label,
			dbDataCreatedAt: new Date().toISOString()
		}).onConflictDoNothing().run();

		console.log("Initialized New Database")

	}
}

// SeedDefault().catch((err) => {
//   console.error("Error seeding default site:", err);
// });

