type Result<DataType> = [unknown, null] | [null, DataType];

async function safe<DataType>(
	fn: Promise<DataType> | (() => Promise<DataType>),
): Promise<Result<DataType>> {
	try {
		if (typeof fn === "function") {
			return [null, await fn()];
		}
		return [null, await fn];
	} catch (err) {
		return [err, null];
	}
}

function safeSync<DataType>(fn: () => DataType): Result<DataType> {
	try {
		return [null, fn()];
	} catch (err) {
		return [err, null];
	}
}

export { safe, safeSync };
