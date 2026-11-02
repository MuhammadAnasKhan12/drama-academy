CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` text,
	`at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`by` text NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `audit_booking_idx` ON `audit_log` (`booking_id`);--> statement-breakpoint
CREATE TABLE `booking_children` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`dob` text NOT NULL,
	`needs` text NOT NULL,
	`photo_consent` integer NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `children_booking_idx` ON `booking_children` (`booking_id`);--> statement-breakpoint
CREATE TABLE `booking_items` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`child_id` text NOT NULL,
	`item_id` text NOT NULL,
	`price_pence` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`child_id`) REFERENCES `booking_children`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `items_item_idx` ON `booking_items` (`item_id`);--> statement-breakpoint
CREATE INDEX `items_booking_idx` ON `booking_items` (`booking_id`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`parent_first_name` text NOT NULL,
	`parent_last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`street` text NOT NULL,
	`street2` text DEFAULT '' NOT NULL,
	`town` text NOT NULL,
	`county` text DEFAULT '' NOT NULL,
	`postcode` text NOT NULL,
	`total_pence` integer NOT NULL,
	`stripe_payment_intent_id` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`hold_expires_at` text NOT NULL,
	`paid_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_reference_idx` ON `bookings` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_pi_idx` ON `bookings` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE TABLE `item_settings` (
	`item_id` text PRIMARY KEY NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`received_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
