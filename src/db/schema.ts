import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const dbIdentity = sqliteTable("dbIdentity", {
  dbId: text("dbId").primaryKey().$default(() => "singleton"),
  dbLabel: text("dbLabel"),

  dbTitle: text("dbTitle"),
  dbDescription: text("dbDescription"),

  dbDataCreatedAt: text("dbDataCreatedAt"),
  dbDataUpdatedAt: text("dbDataUpdatedAt"),
  dbDataDeletedAt: text("dbDataDeletedAt"),
});


export const accountToken = sqliteTable("accountToken", {
	accountTokenHash: text("accountTokenHash").primaryKey(),
	accountTokenExpireAt: text("accountTokenExpireAt"),
	accountUserRefrence: text("accountUserRefrence"),
	accountTokenAction: text("accountTokenAction", {enum: ["create", "reset"]}),
})


export const user = sqliteTable("user", {
	userId: text("userId").primaryKey(),
	userPayroll: text("userPayroll"),
	userName: text("userName"),
	userHash: text("userHash"),
	userCreatedAt: text("userCreatedAt"),
	userIsActive: integer("userIsActive", {mode: "boolean"}).notNull().default(true),
})

export const event = sqliteTable("event", {
	eventId: text("eventId").primaryKey(),
	eventlabel: text("eventlabel"),

	eventTitle: text("eventTitle"),
	eventDescription: text("eventDescription"),


	eventCreatedAt: text("eventCreatedAt"),
	eventUpdatedAt : text("eventUpdatedAt"),
	eventDeletedAt: text("eventDeletedAt"),

	eventScheduledStartAt: text("eventScheduledStartAt"),
	eventScheduledEndAt: text("eventScheduledEndAt"),
	eventIsPinned: integer("eventIsPinned", {mode: "boolean"}).notNull().default(false),

	dbId: text("dbId").notNull().references(() => dbIdentity.dbId),
})




export const question = sqliteTable("question", {
	questionId: text("questionId").primaryKey(),
	questionlabel: text("questionlabel"),

	questionTitle: text("questionTitle"),
	questionDescription: text("questionDescription"),

	questionCreatedAt: text("questionCreatedAt"),
	questionUpdatedAt: text("questionUpdatedAt"),
	questionDeletedAt: text("questionDeletedAt"),

	questionIsCollapsed: integer("questionIsCollapsed", {mode: "boolean"}).notNull().default(false), 
	questionType: text("questionType", {enum: ["checkbox","radio"]}),
	questionIsRequired: integer("questionIsRequired", {mode: "boolean"}),

	eventId: text("eventId").notNull().references(() => event.eventId)
})


export const option = sqliteTable("option", {
	optionId: text("optionId").primaryKey(),
	optionlabel: text("optionlabel"),

	optionTitle: text("optionTitle"),

	optionCreatedAt: text("optionCreatedAt"),
	optionUpdatedAt: text("optionUpdatedAt"),
	optionDeletedAt: text("optionDeletedAt"),

	optionKey: integer("optionKey", { mode: "boolean" })
  .notNull()
  .default(false),

	questionId: text("questionId").notNull().references(() => question.questionId)
})



export const questionRelations = relations(question, ({ many }) => ({
  options: many(option),
}));

export const optionRelations = relations(option, ({ one }) => ({
  question: one(question, {
    fields: [option.questionId],
    references: [question.questionId],
  }),
}));


export const participant = sqliteTable("participant", {
	participantId: text("participantId").primaryKey(),
	participantlabel: text("participantlabel"),

	participantName: text("participantName"),
	participantPayrollId: text("participantPayrollId"),
	participantDepartment: text("participantDepartment"),
	participantDesignation: text("participantDesignation"),

	participantCreatedAt: text("participantCreatedAt"),
	participantUpdatedAt: text("participantUpdatedAt"),
	participantDeletedAt: text("participantDeletedAt"),

	eventId: text("eventId").notNull().references(() => event.eventId)
})

// user submitting there submission,
export const submission = sqliteTable("submission", {
	submissionId: text("submissionId").primaryKey(),

	submissionCreatedAt: text("submissionCreatedAt"),
	submissionUpdatedAt: text("submissionUpdatedAt"),
	submissionDeletedAt: text("submissionDeletedAt"),

	eventId: text("eventId").notNull().references(() => event.eventId),
	participantId: text("participantId").notNull().references(() => participant.participantId),
})


export const response = sqliteTable("response", {
	responseId: text("responseId").primaryKey(),

	responseCreatedAt: text("responseCreatedAt"),
	responseUpdatedAt: text("responseUpdatedAt"),
	responseDeletedAt: text("responseDeletedAt"),

	questionId: text("questionId").notNull().references(() => question.questionId),
	optionId: text("optionId").notNull().references(() => option.optionId),
  submissionId: text("submissionId").notNull().references(() => submission.submissionId),
})


// --- Relations Definitions ---

export const dbIdentityRelations = relations(dbIdentity, ({ many }) => ({
  events: many(event),
}));

export const participantRelations = relations(participant, ({ many, one }) => ({
	submissions: many(submission),
	event: one(event, {
		fields: [participant.eventId],
		references: [event.eventId],
	}),
}));

export const submissionRelations = relations(submission, ({ many, one }) => ({
	participant: one(participant, {
		fields: [submission.participantId],
		references: [participant.participantId],
	}),
	event: one(event, {
		fields: [submission.eventId],
		references: [event.eventId],
	}),
	responses: many(response),
}));

export const responseRelations = relations(response, ({ one }) => ({
	submission: one(submission, {
		fields: [response.submissionId],
		references: [submission.submissionId],
	}),
	question: one(question, {
		fields: [response.questionId],
		references: [question.questionId],
	}),
	option: one(option, {
		fields: [response.optionId],
		references: [option.optionId],
	}),
}));

export const eventRelations = relations(event, ({ many }) => ({
  submissions: many(submission),
  participants: many(participant),
}));

