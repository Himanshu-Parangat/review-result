interface Config {
  /** The public-facing name of the site (e.g., "GJane Doe") */
  name: string;

  /** The main title shown on the site (e.g., in <title> tag) */
  title: string;

  /** A short description for SEO and sharing */
  description: string;

  /** A banner image */
	banner: string;

  /** Copyright notice (e.g., site owner or organization) */
  copyright: string;

  /** Base site URL (must end with a slash) */
  url: string;

  /** Base db path (./store.db) */
	dbPath : string;

  /** Base db migration path (./drizzle) */
	dbMigration: string;

}


const env = import.meta.env; 

export const config: Config  = {
	// Key : env value || Fallback value,
	name : env.PUBLIC_SITE_NAME || "Anonymous",
  title: env.PUBLIC_SITE_TITLE || "Result Review",
  description: env.PUBLIC_SITE_DESCRIPTION || "Simple result reviewing website",
	banner: env.PUBLIC_SITE_BANNER || "https://placehold.co/600x400?text=Banner",
	copyright: env.PUBLIC_SITE_COPYRIGHT || "anonymous",
	url : env.PUBLIC_SITE_URL || "https://www.example.com/",

	dbPath : env.PUBLIC_SITE_DB_PATH || "store.db",
	dbMigration: env.PUBLIC_SITE_DB_MIGRATION_PATH || "drizzle"
}


