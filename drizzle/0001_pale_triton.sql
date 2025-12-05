ALTER TABLE `participant` ADD `participantDesignation` text;--> statement-breakpoint
ALTER TABLE `participant` ADD `eventId` text NOT NULL REFERENCES event(eventId);--> statement-breakpoint
ALTER TABLE `participant` DROP COLUMN `participantEmail`;--> statement-breakpoint
ALTER TABLE `participant` DROP COLUMN `participantPhone`;