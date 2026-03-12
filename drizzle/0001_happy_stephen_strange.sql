CREATE TABLE `hydrationGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dailyGoalMl` int NOT NULL,
	`weight` int,
	`activityLevel` varchar(50),
	`climate` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hydrationGoals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hydrationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amountMl` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hydrationLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mealImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mealId` int NOT NULL,
	`userId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mealImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`calories` int,
	`protein` int,
	`carbs` int,
	`fat` int,
	`mealType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meals_id` PRIMARY KEY(`id`)
);
