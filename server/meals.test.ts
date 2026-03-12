import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMealContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-meals",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("meals router", () => {
  it("should create a meal", async () => {
    const { ctx } = createMealContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.meals.create({
      title: "Breakfast",
      description: "Eggs and toast",
      calories: 350,
      protein: 15,
      carbs: 40,
      fat: 12,
      mealType: "breakfast",
    });

    expect(result).toBeDefined();
    expect(result[0]?.insertId).toBeGreaterThan(0);
  });

  it("should list user meals", async () => {
    const { ctx } = createMealContext();
    const caller = appRouter.createCaller(ctx);

    // Create a meal first
    await caller.meals.create({
      title: "Lunch",
      description: "Chicken salad",
      calories: 450,
      mealType: "lunch",
    });

    // List meals
    const meals = await caller.meals.list();

    expect(Array.isArray(meals)).toBe(true);
  });

  it("should require authenticated user for meal operations", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.meals.create({
        title: "Test",
      });
      expect.fail("Should have thrown error for unauthenticated user");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });
});
