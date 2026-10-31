import { type Assessment, assessmentConstraints } from "@src/schema/schemaAssessment";
import { coreConstraints } from "@src/schema/schemaCore";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const assessmentTable = sqliteTable("assessment", {
	assessmentId: text({ length: coreConstraints.id.exactValue })
		.$type<Assessment["assessmentId"]>()
		.primaryKey(),
	assessmentSubject: text({
		length: assessmentConstraints.assessmentSubject.maxValue,
	}).notNull(),
	assessmentBody: text({
		length: assessmentConstraints.assessmentBody.maxValue,
	}).notNull(),
	assessmentIsPinned: integer({ mode: "boolean" })
		.default(assessmentConstraints.assessmentIsPinned.defaultBooleanValue)
		.notNull(),
	assessmentIsActive: integer({ mode: "boolean" })
		.default(assessmentConstraints.assessmentIsActive.defaultBooleanValue)
		.notNull(),
} as const satisfies Record<keyof Assessment, unknown>);

export { assessmentTable };
