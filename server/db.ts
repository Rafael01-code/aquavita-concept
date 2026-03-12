import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, meals, InsertMeal, mealImages, InsertMealImage, hydrationGoals, InsertHydrationGoal, hydrationLogs, InsertHydrationLog, userProfiles, InsertUserProfile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Meal queries
export async function createMeal(meal: InsertMeal) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(meals).values(meal);
  return result;
}

export async function getUserMeals(userId: number) {
  const db = await getDb();
  if (!db) {
    return []; // Return empty array if DB not available
  }
  const result = await db.select().from(meals).where(eq(meals.userId, userId));
  return result || []; // Ensure array is always returned
}

export async function updateMeal(mealId: number, updates: Partial<InsertMeal>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.update(meals).set(updates).where(eq(meals.id, mealId));
}

// Meal image queries
export async function createMealImage(image: InsertMealImage) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.insert(mealImages).values(image);
}

export async function getMealImages(mealId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.select().from(mealImages).where(eq(mealImages.mealId, mealId));
}

// Hydration goal queries
export async function createOrUpdateHydrationGoal(goal: InsertHydrationGoal) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const existing = await db.select().from(hydrationGoals).where(eq(hydrationGoals.userId, goal.userId!));
  
  if (existing.length > 0) {
    return db.update(hydrationGoals).set(goal).where(eq(hydrationGoals.userId, goal.userId!));
  }
  return db.insert(hydrationGoals).values(goal);
}

export async function getUserHydrationGoal(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.select().from(hydrationGoals).where(eq(hydrationGoals.userId, userId)).limit(1);
  if (result.length > 0) {
    return result[0];
  }
  // Return default goal if none exists
  return {
    id: 0,
    userId,
    dailyGoalMl: 2000, // Default 2L per day
    weight: null,
    activityLevel: "moderate",
    climate: "temperate",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Hydration log queries
export async function createHydrationLog(log: InsertHydrationLog) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.insert(hydrationLogs).values(log);
}

export async function getUserHydrationLogs(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) {
    return []; // Return empty array if DB not available
  }
  const result = await db.select().from(hydrationLogs).where(eq(hydrationLogs.userId, userId)).limit(limit);
  return result || []; // Ensure array is always returned
}

// User profile queries
export async function createOrUpdateUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, profile.userId!));
  
  if (existing.length > 0) {
    return db.update(userProfiles).set(profile).where(eq(userProfiles.userId, profile.userId!));
  }
  return db.insert(userProfiles).values(profile);
}

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}


// Função para calcular meta de hidratação inteligente
export async function calculateSmartHydrationGoal(
  weight: number,
  age: number,
  exercisesRegularly: boolean,
  exerciseDuration?: number,
  climate?: string
): Promise<number> {
  // Fórmula base: peso em kg × 35ml (recomendação geral)
  let baseMl = weight * 35;

  // Ajuste por idade (pessoas mais velhas precisam de mais água)
  if (age > 60) {
    baseMl *= 1.1; // +10%
  } else if (age < 18) {
    baseMl *= 0.9; // -10%
  }

  // Ajuste por atividade física
  if (exercisesRegularly) {
    const durationHours = (exerciseDuration || 60) / 60;
    baseMl += durationHours * 500; // +500ml por hora de exercício
  }

  // Ajuste por clima
  if (climate === "tropical" || climate === "quente") {
    baseMl *= 1.2; // +20%
  } else if (climate === "seco") {
    baseMl *= 1.15; // +15%
  }

  // Garantir mínimo de 1500ml e máximo de 4000ml
  return Math.max(1500, Math.min(Math.round(baseMl), 4000));
}
