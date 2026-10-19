import { OpenAPIHono } from "@hono/zod-openapi";
import { getHealthDefinition } from "@src/modules/health/healthDefinition";
import { getHealthHandler } from "@src/modules/health/healthHandler/getHealth";

const healthRouter = new OpenAPIHono();

healthRouter.openapi(getHealthDefinition, getHealthHandler);

export { healthRouter };
