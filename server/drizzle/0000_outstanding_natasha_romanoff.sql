CREATE TABLE `layers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` integer DEFAULT 8 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `samples` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`bpm` integer,
	`primary_tag_name` text,
	`favorite` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`primary_tag_name`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`position` integer NOT NULL,
	`layerId` integer NOT NULL,
	`sample_id` text NOT NULL,
	`color` integer DEFAULT 5 NOT NULL,
	`useTagColor` integer DEFAULT true NOT NULL,
	PRIMARY KEY(`layerId`, `position`),
	FOREIGN KEY (`layerId`) REFERENCES `layers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sample_id`) REFERENCES `samples`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`name` text PRIMARY KEY NOT NULL,
	`color` integer DEFAULT 13 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags_to_samples` (
	`tag_name` text NOT NULL,
	`sample_id` text NOT NULL,
	PRIMARY KEY(`tag_name`, `sample_id`),
	FOREIGN KEY (`tag_name`) REFERENCES `tags`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sample_id`) REFERENCES `samples`(`id`) ON UPDATE no action ON DELETE no action
);
