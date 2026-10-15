import { Hono } from "hono";
import { env } from "./env";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

export default {
	port: env.PORT,
	hostname: env.HOST,
	fetch: app.fetch,
};
