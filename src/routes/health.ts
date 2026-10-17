import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { httpStatusCode } from "@src/schema/httpStatusCodes.schema";



const router = new OpenAPIHono(); 

const healthResponseSchema = z.object({
	status: z.literal("ok"),
});

const getHealthRoute = createRoute({
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



export const healthRouter = router.openapi(getHealthRoute, (c) =>
	c.json({ status: "ok" as const }, httpStatusCode.ok),
);
