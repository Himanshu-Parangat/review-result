import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Env } from "hono";

const pairRegister = <TypeRoute extends RouteConfig, TypeEnv extends Env = Env>(
	router: OpenAPIHono<TypeEnv>,
	route: TypeRoute & { getRoutingPath: () => string },
	handler: RouteHandler<TypeRoute, TypeEnv>,
) => {
	router.openAPIRegistry.registerPath(route);
	router.on(route.method, route.getRoutingPath(), handler as never);
	return router;
};

function buildAllowedCharacterRegex(allowedCharacter: string) {
	return new RegExp(`^[${allowedCharacter}]+$`);
}

export { buildAllowedCharacterRegex, pairRegister };
