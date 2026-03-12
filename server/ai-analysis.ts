import { invokeLLM } from "./_core/llm";

export interface FoodAnalysisResult {
  foods: Array<{
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: number;
}

/**
 * Analyze a meal image using Claude's vision capabilities
 * Returns nutritional information extracted from the image
 */
export async function analyzeMealImage(
  imageUrl: string
): Promise<FoodAnalysisResult> {
  const systemPrompt = `You are a nutrition expert AI assistant. When given an image of food, analyze it and provide detailed nutritional information.

Respond with a JSON object with these fields:
- foods: array of food items with name, quantity, calories, protein, carbs, fat
- totalCalories: sum of all calories
- totalProtein: sum of all protein in grams
- totalCarbs: sum of all carbs in grams
- totalFat: sum of all fat in grams
- confidence: confidence level from 0 to 1

Be as accurate as possible based on visual estimation.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this meal image and provide nutritional information in JSON format.",
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high",
            },
          },
        ] as any,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "food_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            foods: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  quantity: { type: "string" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                },
                required: ["name", "quantity", "calories", "protein", "carbs", "fat"],
                additionalProperties: false,
              },
            },
            totalCalories: { type: "number" },
            totalProtein: { type: "number" },
            totalCarbs: { type: "number" },
            totalFat: { type: "number" },
            confidence: { type: "number" },
          },
          required: [
            "foods",
            "totalCalories",
            "totalProtein",
            "totalCarbs",
            "totalFat",
            "confidence",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return JSON.parse(content) as FoodAnalysisResult;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to analyze meal image");
  }
}
