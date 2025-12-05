import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const dbIdentity = sqliteTable("dbIdentity", {
  dbId: text("dbId").primaryKey().$default(() => "singleton"),
  dbLabel: text("dbLabel"),
  dbDataCreatedAt: text("dbDataCreatedAt"),
  dbTitle: text("dbTitle"),
  dbDescription: text("dbDescription"),
});


export const event = sqliteTable("event", {
	eventId: text("eventId").primaryKey(),
	eventlabel: text("eventlabel"),
	eventTitle: text("eventTitle"),
	eventCreatedAt: text("eventCreatedAt"),
	eventDescription: text("eventDescription"),
	eventScheduledStartAt: text("eventScheduledStartAt"),
	eventScheduledEndAt: text("eventScheduledEndAt"),
	eventIsPinned: integer("eventIsPinned", {mode: "boolean"}).notNull().default(false),

	dbId: text("dbId").notNull().references(() => dbIdentity.dbId),
})




export const question = sqliteTable("question", {
	questionId: text("questionId").primaryKey(),
	questionlabel: text("questionlabel"),
	questionCreatedAt: text("questionCreatedAt"),
	questionTitle: text("questionTitle"),
	questionDescription: text("questionDescription"),
	questionType: text("questionType", {enum: ["checkbox","radio"]}),
	questionIsRequired: integer("questionIsRequired", {mode: "boolean"}),
	questionOrder: integer("questionOrder"),

	eventId: text("eventId").notNull().references(() => event.eventId)
})


export const option = sqliteTable("option", {
	optionId: text("optionId").primaryKey(),
	optionlabel: text("optionlabel"),
	optionCreatedAt: text("optionCreatedAt"),
	optionTitle: text("optionTitle"),
	optionOrder: integer("optionOrder"),
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
	participantCreatedAt: text("participantCreatedAt"),
	participantName: text("participantName"),
	participantPayrollId: text("participantPayrollId"),
	participantDepartment: text("participantDepartment"),
	participantDesignation: text("participantDesignation"),
	eventId: text("eventId").notNull().references(() => event.eventId)
})

// user submitting there submission,
export const submission = sqliteTable("submission", {
	submissionId: text("submissionId").primaryKey(),
	submissionCreatedAt: text("submissionCreatedAt"),

	eventId: text("eventId").notNull().references(() => event.eventId),
	participantId: text("participantId").notNull().references(() => participant.participantId),
})


export const response = sqliteTable("response", {
	responseId: text("responseId").primaryKey(),
	responseCreatedAt: text("responseCreatedAt"),

	questionId: text("questionId").notNull().references(() => question.questionId),
	optionId: text("optionId").notNull().references(() => option.optionId),
  submissionId: text("submissionId").notNull().references(() => submission.submissionId),
})


// --- Relations Definitions ---

export const dbIdentityRelations = relations(dbIdentity, ({ many }) => ({
  events: many(event),
}));
