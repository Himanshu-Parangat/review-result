ALTER TABLE `session` RENAME COLUMN "sessionDeletedAt" TO "sessionExpiresAt";--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `sessionCreatedAt`;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `sessionUpdatedAt`;