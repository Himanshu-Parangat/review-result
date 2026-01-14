CREATE TABLE `user` (
	`userId` text PRIMARY KEY NOT NULL,
	`userPayroll` text,
	`userName` text,
	`userHash` text,
	`userCreatedAt` text,
	`userIsActive` integer DEFAULT true NOT NULL
);
