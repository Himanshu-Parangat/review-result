import { z } from "@hono/zod-openapi";
import { buildAllowedCharacterRegex } from "@src/shared/schemaHelper";
import type { Brand, ValidConstraints } from "@src/shared/types";
import { coreConstraints } from "./schemaCore";

type AssessmentId = Brand<string, "assessmentId">;

const assessmentConstraints = {
	assessmentSubject: {
		minValue: 4,
		maxValue: 255,
	},

	assessmentBody: {
		minValue: 4,
		maxValue: 455,
	},

	assessmentIsPinned: {
		defaultBooleanValue: false,
	},
	assessmentIsActive: {
		defaultBooleanValue: false,
	},
} as const satisfies Record<string, ValidConstraints>;

const assessmentSchema = z.object({
	assessmentId: z
		.string()
		.trim()
		.length(coreConstraints.id.exactValue)
		.regex(buildAllowedCharacterRegex(coreConstraints.id.allowedCharacter))
		.pipe(z.custom<AssessmentId>()),

	assessmentSubject: z
		.string()
		.trim()
		.min(assessmentConstraints.assessmentSubject.minValue)
		.max(assessmentConstraints.assessmentSubject.maxValue),

	assessmentBody: z
		.string()
		.trim()
		.min(assessmentConstraints.assessmentBody.minValue)
		.max(assessmentConstraints.assessmentBody.maxValue),

	assessmentIsPinned: z
		.boolean()
		.default(assessmentConstraints.assessmentIsPinned.defaultBooleanValue),
	assessmentIsActive: z
		.boolean()
		.default(assessmentConstraints.assessmentIsActive.defaultBooleanValue),
});

type Assessment = z.infer<typeof assessmentSchema>;

export { type Assessment, assessmentConstraints, assessmentSchema };
