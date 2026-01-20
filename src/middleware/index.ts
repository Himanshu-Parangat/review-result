import { checkCookie } from "@utils/CookieUtil";
import { defineMiddleware, sequence } from "astro:middleware";
import { isDbInitialized } from "@db/index";
import { genrateLog } from "@utils/loggingUtils";
import { chechSessionToken } from "@utils/authUtils";
import { config } from "@config";

export const dbCheckMiddleware = defineMiddleware(async (context, next) => {
  const {  url } = context;

  if (url.pathname === "/admin/status" || url.pathname === "/login") {
    return next();
  }


	if (!isDbInitialized()) {

		genrateLog()
			.time()
			.blue("[DB]")
			.yellow("Database not initialized")
			.cyan("redirecting to")
			.green("/admin/status")
			.print()
		return context.redirect("/admin/status?dbInit=now");
	}
	
	return next();

});


export const logMiddleware = defineMiddleware((context, next) => {
  const { request, url } = context;

	genrateLog()
		.time()
		.blue(`[Incoming ${request.method} Request]`)
		.cyan("At")
		.green(url.pathname)
		.cyan("From")
		.magenta(url.host)
		.print();

  return next();
});


export const routeCheckMiddleware = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  if (url.pathname.startsWith("/admin")) {
    const Cookie = checkCookie(request);

		const token = import.meta.env.HASH_TOKEN
    if (Cookie.Id === token) {
      return next(); 
    }
		return Response.redirect(
      new URL(`/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`, request.url),
      302
    );

  }

  return next();
});


export const accountsRouteCheckMiddleware = defineMiddleware(async (context, next) => {
  const { request, url, cookies } = context;

  if (url.pathname.startsWith("/organize")) {

		const sessionCookieToken = cookies.get(config.sessionCookieIdentifier)?.value;

    const auth = await chechSessionToken(sessionCookieToken);

    if (!auth) {
      return Response.redirect(
        new URL(
          `/auth?redirectTo=${encodeURIComponent(url.pathname + url.search)}`,
          request.url
        ),
        302
      );
    }
  }

  return next();
});


export const onRequest = sequence(logMiddleware, dbCheckMiddleware, routeCheckMiddleware, accountsRouteCheckMiddleware);
