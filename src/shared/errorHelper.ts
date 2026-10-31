type Result<DataType, ErrorType extends Error = Error> =
	| { success: true; data: DataType }
	| { success: false; error: ErrorType };

function toError(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	}
	return new Error(String(error), { cause: error });
}

async function safe<DataType, ErrorType extends Error = Error>(
	fn: Promise<DataType> | (() => Promise<DataType>),
	mapError?: (err: unknown) => ErrorType,
): Promise<Result<DataType, ErrorType>> {
	const toErr = (mapError ?? toError) as (err: unknown) => ErrorType;
	try {
		if (typeof fn === "function") {
			return { success: true, data: await fn() };
		}
		return { success: true, data: await fn };
	} catch (err) {
		return { success: false, error: toErr(err) };
	}
}

function safeSync<DataType, ErrorType extends Error = Error>(
	fn: () => DataType,
	mapError?: (err: unknown) => ErrorType,
): Result<DataType, ErrorType> {
	const toErr = (mapError ?? toError) as (err: unknown) => ErrorType;
	try {
		return { success: true, data: fn() };
	} catch (err) {
		return { success: false, error: toErr(err) };
	}
}

export { type Result, safe, safeSync };
