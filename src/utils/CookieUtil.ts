export function checkCookie(request: Request): Record<string,string> {

	const cookies: Record<string, string> = {};

  const cookieHeader = request.headers.get("cookie") || "";
	const cookiesPairs = cookieHeader.split(";").map(c => c.trim())

	cookiesPairs.forEach(element => {
		const [key, ...part] = element.split("=")
		const value = part.join("=")

		cookies[key] = value
	})

  return cookies;
}

