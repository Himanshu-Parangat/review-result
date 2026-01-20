import { parseDuration } from "@utils/TimeUtils";

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

  /** Argon2 memory cost value */
	hashMemoryCost: number;

  /** Argon2 time cost value */
	hashComputeTimeCost: number;

  /** Argon2 parallelism value */
	hashComputeParallelism: number;


  /** Max Duration for one time account password creation link */
	createPasswordTokenDuration: number;

  /** Max Duration for one time account password reset link */
	resetPasswordTokenDuration: number;


  /** session key for auth */
	sessionCookieIdentifier: string;

  /** Max Session Login Duration */
	sessionCookieDuration: number;

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
	dbMigration: env.PUBLIC_SITE_DB_MIGRATION_PATH || "drizzle", 


	hashMemoryCost: env.HASH_MEMORY_COST || "65536",
	hashComputeTimeCost: env.HASH_COMPUTE_TIME_COST || "2",
	hashComputeParallelism: env.HASH_COMPUTE_PARALLELISM || "1",

	createPasswordTokenDuration: parseDuration(env.CREATE_PASSWORD_TOKEN_DURATION || "1d"),
	resetPasswordTokenDuration: parseDuration(env.RESET_PASSWORD_TOKEN_DURATION || "1h"),

	sessionCookieIdentifier: env.SESSION_COOKIE_IDENTIFIER || "_workspace_state_",
	sessionCookieDuration: parseDuration(env.SESSION_COOKIE_DURATION || "45m"),
}


