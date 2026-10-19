import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { httpStatusCode } from "@src/schema/schemaHttpStatusCodes";

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

export { type GetHealthRoute, getHealthDefinition };
