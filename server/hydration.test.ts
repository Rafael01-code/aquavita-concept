import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createHydrationContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "test-user-hydration",
    email: "hydration@example.com",
    name: "Hydration Test",
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
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("hydration router", () => {
  it("should set hydration goal", async () => {
    const ctx = createHydrationContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.hydration.setGoal({
      dailyGoalMl: 2500,
      weight: 75,
      activityLevel: "moderate",
      climate: "temperate",
    });

    expect(result).toBeDefined();
  });

  it("should get hydration goal", async () => {
    const ctx = createHydrationContext();
    const caller = appRouter.createCaller(ctx);

    // Set goal first
    await caller.hydration.setGoal({
      dailyGoalMl: 2000,
    });

    // Get goal
    const goal = await caller.hydration.getGoal();

    expect(goal).toBeDefined();
    expect(goal?.dailyGoalMl).toBe(2000);
  });

  it("should log water intake", async () => {
    const ctx = createHydrationContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.hydration.logWater({
      amountMl: 250,
      source: "manual",
    });

    expect(result).toBeDefined();
  });

  it("should get hydration logs", async () => {
    const ctx = createHydrationContext();
    const caller = appRouter.createCaller(ctx);

    // Log some water
    await caller.hydration.logWater({
      amountMl: 500,
    });

    // Get logs
    const logs = await caller.hydration.getLogs({ limit: 10 });

    expect(Array.isArray(logs)).toBe(true);
  });

  it("should validate daily goal range", async () => {
    const ctx = createHydrationContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.hydration.setGoal({
        dailyGoalMl: 100, // Too low
      });
      expect.fail("Should have rejected invalid goal");
    } catch (error: any) {
      expect(error.message).toContain(">=500");
    }
  });

  it("should require authenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.hydration.setGoal({
        dailyGoalMl: 2000,
      });
      expect.fail("Should have thrown error for unauthenticated user");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });
});
