import { createRoute, OpenAPIHono, type RouteHandler, z } from "@hono/zod-openapi";
import { httpStatusCode } from "@src/schema/schemaHttpStatusCodes";
import { pairRegister } from "@src/shared/schemaHelper";

const healthRoute = new OpenAPIHono();

const healthResponseSchema = z.object({
	status: z.literal("ok"),
});

const getHealthDefinition = createRoute({
	method: "get",
	path: "/health",
	tags: ["System"],
	summary: "Health check",
	responses: {
		[httpStatusCode.ok]: {
			description: "Service is healthy",
			content: { "application/json": { schema: healthResponseSchema } },
		},
	},
});

type GetHealthRoute = RouteHandler<typeof getHealthDefinition>;

const getHealthHandler: GetHealthRoute = (c) =>
	c.json({ status: "ok" as const }, httpStatusCode.ok);

pairRegister(healthRoute, getHealthDefinition, getHealthHandler);

export { healthRoute };
