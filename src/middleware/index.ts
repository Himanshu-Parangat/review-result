import { checkCookie } from "@utils/CookieUtil";
import { defineMiddleware, sequence } from "astro:middleware";
import { isDbInitialized } from "@db/index";
import { genrateLog } from "@utils/loggingUtils";

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

export const onRequest = sequence(logMiddleware, dbCheckMiddleware, routeCheckMiddleware);
