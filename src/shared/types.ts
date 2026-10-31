type Prettify<ObjectType extends object> = { [Key in keyof ObjectType]: ObjectType[Key] } & {};

declare const __brand: unique symbol;

type Brand<Type, BrandType extends string> = Type & { [__brand]: BrandType };
type ValidConstraints = Partial<{
	minValue: number;
	maxValue: number;
	exactValue: number;
	allowedLiteralValue: readonly [string, ...string[]];
	allowedCharacter: string;
	defaultBooleanValue: boolean;
	defaultNumberValue: number;
}>;

export type { Brand, Prettify, ValidConstraints };
