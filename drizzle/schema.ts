import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile table for storing personal health information
 */
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  height: int("height"), // in cm
  weight: int("weight"), // in kg
  exercisesRegularly: boolean("exercisesRegularly").default(false).notNull(),
  exerciseFrequency: varchar("exerciseFrequency", { length: 50 }), // daily, 3-4_times_week, 1-2_times_week, rarely
  exerciseDuration: int("exerciseDuration"), // in minutes
  planType: varchar("planType", { length: 50 }).default("free").notNull(),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// TODO: Add your tables here
/**
 * Meals table for storing user meal records
 */
export const meals = mysqlTable("meals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  calories: int("calories"),
  protein: int("protein"), // in grams
  carbs: int("carbs"), // in grams
  fat: int("fat"), // in grams
  mealType: varchar("mealType", { length: 50 }), // breakfast, lunch, dinner, snack
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Meal = typeof meals.$inferSelect;
export type InsertMeal = typeof meals.$inferInsert;

/**
 * Meal images table for storing photos of meals
 */
export const mealImages = mysqlTable("mealImages", {
  id: int("id").autoincrement().primaryKey(),
  mealId: int("mealId").notNull(),
  userId: int("userId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 file key
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // in bytes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealImage = typeof mealImages.$inferSelect;
export type InsertMealImage = typeof mealImages.$inferInsert;

/**
 * Hydration goals table for storing user hydration targets
 */
export const hydrationGoals = mysqlTable("hydrationGoals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dailyGoalMl: int("dailyGoalMl").notNull(), // daily water intake goal in ml
  weight: int("weight"), // user weight in kg
  activityLevel: varchar("activityLevel", { length: 50 }), // sedentary, light, moderate, intense
  climate: varchar("climate", { length: 50 }), // cold, temperate, hot
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HydrationGoal = typeof hydrationGoals.$inferSelect;
export type InsertHydrationGoal = typeof hydrationGoals.$inferInsert;

/**
 * Hydration logs table for tracking daily water intake
 */
export const hydrationLogs = mysqlTable("hydrationLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amountMl: int("amountMl").notNull(), // water intake in ml
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  source: varchar("source", { length: 100 }), // manual, smartwatch, app
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HydrationLog = typeof hydrationLogs.$inferSelect;
export type InsertHydrationLog = typeof hydrationLogs.$inferInsert;

/**
 * User achievements/badges table for gamification
 */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: varchar("badgeId", { length: 64 }).notNull(),
  badgeName: varchar("badgeName", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * User points and levels table for gamification
 */
export const userPoints = mysqlTable("userPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalPoints: int("totalPoints").default(0).notNull(),
  level: int("level").default(1).notNull(),
  currentLevelProgress: int("currentLevelProgress").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPoint = typeof userPoints.$inferSelect;
export type InsertUserPoint = typeof userPoints.$inferInsert;

/**
 * User challenges table for weekly/monthly challenges
 */
export const userChallenges = mysqlTable("userChallenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: varchar("challengeId", { length: 64 }).notNull(),
  challengeName: varchar("challengeName", { length: 255 }).notNull(),
  description: text("description"),
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  rewardPoints: int("rewardPoints").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;
