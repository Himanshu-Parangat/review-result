CREATE TABLE `dbIdentity` (
	`dbId` text PRIMARY KEY NOT NULL,
	`dbLabel` text,
	`dbTitle` text,
	`dbDescription` text,
	`dbDataCreatedAt` text,
	`dbDataUpdatedAt` text,
	`dbDataDeletedAt` text
);
--> statement-breakpoint
CREATE TABLE `event` (
	`eventId` text PRIMARY KEY NOT NULL,
	`eventlabel` text,
	`eventTitle` text,
	`eventDescription` text,
	`eventCreatedAt` text,
	`eventUpdatedAt` text,
	`eventDeletedAt` text,
	`eventScheduledStartAt` text,
	`eventScheduledEndAt` text,
	`eventIsPinned` integer DEFAULT false NOT NULL,
	`dbId` text NOT NULL,
	FOREIGN KEY (`dbId`) REFERENCES `dbIdentity`(`dbId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `option` (
	`optionId` text PRIMARY KEY NOT NULL,
	`optionlabel` text,
	`optionTitle` text,
	`optionCreatedAt` text,
	`optionUpdatedAt` text,
	`optionDeletedAt` text,
	`optionKey` integer DEFAULT false NOT NULL,
	`questionId` text NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`questionId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`participantId` text PRIMARY KEY NOT NULL,
	`participantlabel` text,
	`participantName` text,
	`participantPayrollId` text,
	`participantDepartment` text,
	`participantDesignation` text,
	`participantCreatedAt` text,
	`participantUpdatedAt` text,
	`participantDeletedAt` text,
	`eventId` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`eventId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `question` (
	`questionId` text PRIMARY KEY NOT NULL,
	`questionlabel` text,
	`questionTitle` text,
	`questionDescription` text,
	`questionCreatedAt` text,
	`questionUpdatedAt` text,
	`questionDeletedAt` text,
	`questionIsCollapsed` integer DEFAULT false NOT NULL,
	`questionType` text,
	`questionIsRequired` integer,
	`eventId` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`eventId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `response` (
	`responseId` text PRIMARY KEY NOT NULL,
	`responseCreatedAt` text,
	`responseUpdatedAt` text,
	`responseDeletedAt` text,
	`questionId` text NOT NULL,
	`optionId` text NOT NULL,
	`submissionId` text NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`questionId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`optionId`) REFERENCES `option`(`optionId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`submissionId`) REFERENCES `submission`(`submissionId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submission` (
	`submissionId` text PRIMARY KEY NOT NULL,
	`submissionCreatedAt` text,
	`submissionUpdatedAt` text,
	`submissionDeletedAt` text,
	`eventId` text NOT NULL,
	`participantId` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`eventId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`participantId`) REFERENCES `participant`(`participantId`) ON UPDATE no action ON DELETE no action
);
