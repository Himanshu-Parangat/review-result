import { defineMiddleware, sequence } from "astro:middleware";

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



export const onRequest = sequence(logMiddleware);


