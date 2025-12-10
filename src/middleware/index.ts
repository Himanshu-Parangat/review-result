import { checkCookie } from "@utils/CookieUtil";
import { defineMiddleware, sequence } from "astro:middleware";
import { isDbInitialized } from "@db/index";

export const dbCheckMiddleware = defineMiddleware(async (context, next) => {
  const {  url } = context;

  if (url.pathname === "/admin/status" || url.pathname === "/login") {
    return next();
  }


	if (!isDbInitialized()) {
		console.log("Database not initialized, redirecting to /admin/status");
		return context.redirect("/admin/status?dbInit=now");
	}
	
	return next();

});


export const logMiddleware = defineMiddleware((context, next) => {
  const { request, url } = context;

	const now = new Date();
  const timestamp = now.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });


  const log = {
    method: request.method,
    path: url.pathname,
    search: url.search,
    host: url.host,
    userAgent: request.headers.get("user-agent") ?? null,
    ip: request.headers.get("x-forwarded-for") ?? null,
    timestamp
  };

	const LogMessage = `${log.timestamp} [Incoming ${log.method} Request] At "${log.path}" From ${log.host}`

	console.log(LogMessage);

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
