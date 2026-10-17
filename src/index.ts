import { config } from "@src/config";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

// biome-ignore lint/style/noDefaultExport: Required by bun
export default {
	port: config.port,
	hostname: config.host,
	fetch: app.fetch,
};
