import { app } from "@src/app";
import { config } from "@src/config";

// biome-ignore lint/style/noDefaultExport: Required by bun
export default {
	fetch: app.fetch,
	hostname: config.host,
	port: config.port,
};
