import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { config } from "@src/config";
import { healthRouter } from "@src/modules/health/healthRoutes";

const app = new OpenAPIHono({ strict: false });

const routes = app.route("/", healthRouter);

if (config.env !== "production") {
	app.doc31("/openapi.json", {
		openapi: "3.1.0",
		info: {
			title: config.name,
			version: config.version,
			description: config.description,
		},
	});

	app.get("/docs", Scalar({ url: "/openapi.json" }));
}

type App = typeof routes;

export { type App, app };
