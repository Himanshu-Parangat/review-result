import { type Assessment, assessmentConstraints } from "@src/schema/schemaAssessment";
import { coreConstraints } from "@src/schema/schemaCore";
import { bit, char, mssqlTable, nvarchar } from "drizzle-orm/mssql-core";

const assessmentTable = mssqlTable("assessment", {
	assessmentId: char({ length: coreConstraints.id.exactValue })
		.$type<Assessment["assessmentId"]>()
		.primaryKey(),
	assessmentSubject: nvarchar({
		length: assessmentConstraints.assessmentSubject.maxValue,
	}).notNull(),
	assessmentBody: nvarchar({
		length: assessmentConstraints.assessmentBody.maxValue,
	}).notNull(),
	assessmentIsPinned: bit()
		.default(assessmentConstraints.assessmentIsPinned.defaultBooleanValue)
		.notNull(),
	assessmentIsActive: bit()
		.default(assessmentConstraints.assessmentIsActive.defaultBooleanValue)
		.notNull(),
} as const satisfies Record<keyof Assessment, unknown>);

export { assessmentTable };
