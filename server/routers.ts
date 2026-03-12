import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import * as db from "./db";
import { nanoid } from "nanoid";
import { analyzeMealImage } from "./ai-analysis";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  meals: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbs: z.number().optional(),
          fat: z.number().optional(),
          mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const meal = await db.createMeal({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          mealType: input.mealType,
        });
        return meal;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserMeals(ctx.user.id);
    }),

    uploadImage: protectedProcedure
      .input(
        z.object({
          mealId: z.number(),
          imageData: z.string(), // base64 encoded image
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.imageData, "base64");
        const fileKey = `meals/${ctx.user.id}/${input.mealId}/${nanoid()}.jpg`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Save to database
        const mealImage = await db.createMealImage({
          mealId: input.mealId,
          userId: ctx.user.id,
          imageUrl: url,
          fileKey: fileKey,
          mimeType: input.mimeType,
          fileSize: buffer.length,
        });

        return mealImage;
      }),
  }),

  hydration: router({
    setGoal: protectedProcedure
      .input(
        z.object({
          dailyGoalMl: z.number().min(500),
          weight: z.number().optional(),
          activityLevel: z.string().optional(),
          climate: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.createOrUpdateHydrationGoal({
          userId: ctx.user.id,
          dailyGoalMl: input.dailyGoalMl,
          weight: input.weight,
          activityLevel: input.activityLevel,
          climate: input.climate,
        });
      }),

    getGoal: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserHydrationGoal(ctx.user.id);
    }),

    logWater: protectedProcedure
      .input(
        z.object({
          amountMl: z.number().min(1),
          source: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.createHydrationLog({
          userId: ctx.user.id,
          amountMl: input.amountMl,
          source: input.source || "manual",
        });
      }),

    getLogs: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ ctx, input }) => {
        return db.getUserHydrationLogs(ctx.user.id, input.limit);
      }),
  }),

  ai: router({
    analyzeMeal: protectedProcedure
      .input(
        z.object({
          imageUrl: z.string().url(),
          mealId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const analysis = await analyzeMealImage(input.imageUrl);
          await db.updateMeal(input.mealId, {
            calories: analysis.totalCalories,
            protein: analysis.totalProtein,
            carbs: analysis.totalCarbs,
            fat: analysis.totalFat,
          });
          return analysis;
        } catch (error) {
          console.error("AI analysis failed:", error);
          throw new Error("Failed to analyze meal image");
        }
      }),
  }),

  profile: router({
    saveProfile: protectedProcedure
      .input(
        z.object({
          age: z.number().min(1).max(150),
          height: z.number().min(50).max(300),
          weight: z.number().min(20).max(500),
          exercisesRegularly: z.boolean(),
          exerciseFrequency: z.string().optional(),
          exerciseDuration: z.number().optional(),
          planType: z.enum(["free", "premium", "premium_annual"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Calcular meta de hidratação inteligente
        const smartGoal = await db.calculateSmartHydrationGoal(
          input.weight,
          input.age,
          input.exercisesRegularly,
          input.exerciseDuration,
          "tropical" // Padrão para Brasil
        );

        // Salvar perfil
        const profile = await db.createOrUpdateUserProfile({
          userId: ctx.user.id,
          age: input.age,
          height: input.height,
          weight: input.weight,
          exercisesRegularly: input.exercisesRegularly,
          exerciseFrequency: input.exerciseFrequency,
          exerciseDuration: input.exerciseDuration,
          planType: input.planType,
          onboardingCompleted: true,
        });

        // Definir meta de hidratação automaticamente
        await db.createOrUpdateHydrationGoal({
          userId: ctx.user.id,
          dailyGoalMl: smartGoal,
          weight: input.weight,
          activityLevel: input.exercisesRegularly ? "active" : "sedentary",
          climate: "tropical",
        });

        return profile;
      }),

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProfile(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
