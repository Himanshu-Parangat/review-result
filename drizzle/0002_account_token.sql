CREATE TABLE `accountToken` (
	`accountTokenHash` text PRIMARY KEY NOT NULL,
	`accountTokenExpireAt` text,
	`accountTokenAction` text
);
