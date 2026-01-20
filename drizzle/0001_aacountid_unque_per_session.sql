CREATE TABLE `trails` (
	`trailsId` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_accountId_unique` ON `session` (`accountId`);