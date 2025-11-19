CREATE TABLE `dbIdentity` (
	`dbId` text PRIMARY KEY NOT NULL,
	`dbLabel` text,
	`dbDataCreatedAt` text,
	`dbTitle` text,
	`dbDescription` text
);
--> statement-breakpoint
CREATE TABLE `event` (
	`eventId` text PRIMARY KEY NOT NULL,
	`eventlabel` text,
	`eventTitle` text,
	`eventCreatedAt` text,
	`eventDescription` text,
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
	`optionCreatedAt` text,
	`optionTitle` text,
	`optionOrder` integer,
	`optionKey` integer DEFAULT false NOT NULL,
	`questionId` text NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`questionId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`participantId` text PRIMARY KEY NOT NULL,
	`participantlabel` text,
	`participantCreatedAt` text,
	`participantName` text,
	`participantPayrollId` text,
	`participantDepartment` text,
	`participantEmail` text,
	`participantPhone` text
);
--> statement-breakpoint
CREATE TABLE `question` (
	`questionId` text PRIMARY KEY NOT NULL,
	`questionlabel` text,
	`questionCreatedAt` text,
	`questionTitle` text,
	`questionDescription` text,
	`questionType` text,
	`questionIsRequired` integer,
	`questionOrder` integer,
	`eventId` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`eventId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `response` (
	`responseId` text PRIMARY KEY NOT NULL,
	`responseCreatedAt` text,
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
	`eventId` text NOT NULL,
	`participantId` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event`(`eventId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`participantId`) REFERENCES `participant`(`participantId`) ON UPDATE no action ON DELETE no action
);
