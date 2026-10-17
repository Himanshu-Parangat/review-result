import z from "zod";

const httpStatusSchema = z.enum({
	ok: 200,
	created: 201,
	badRequest: 400,
	notFound: 404,
	internalServerError: 500,
});

const httpStatusCode = httpStatusSchema.enum;

type HttpStatusCode = z.infer<typeof httpStatusSchema>; // 200 | 201 | 400 | 404 | 500

export { type HttpStatusCode, httpStatusCode, httpStatusSchema };
