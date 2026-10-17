type Prettify<ObjectType extends object> = { [Key in keyof ObjectType]: ObjectType[Key] } & {};

type ValidConstraints = Partial<{
	minValue: number;
	maxValue: number;
	exactValue: number;
	allowedLiteralValue: readonly [string, ...string[]];
	allowedCharacter: string;
	defaultBooleanValue: boolean;
}>;

export type { Prettify, ValidConstraints };
