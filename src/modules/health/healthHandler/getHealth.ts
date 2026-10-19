import type { GetHealthRoute } from "@src/modules/health/healthDefinition";
import { httpStatusCode } from "@src/schema/schemaHttpStatusCodes";

const getHealthHandler: GetHealthRoute = (c) =>
	c.json({ status: "ok" as const }, httpStatusCode.ok);

export { getHealthHandler };
