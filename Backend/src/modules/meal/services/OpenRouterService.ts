import OpenAI from 'openai';
import { config } from '../../../config';
import { ApiError } from '../../../shared/ApiError';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';
import { AiNutritionResultDto } from '../dtos/Meal.dto';
import { AnalyticsResponseDto } from '../../analytics/dtos/Analytics.dto';

// ─── Reusable AI Prompt ─────────────────────────────────────────────────────────
const NUTRITION_ANALYSIS_PROMPT = `
You are a professional nutritionist AI with expertise in food recognition and nutritional analysis.

Analyze this food image and return ONLY a valid JSON object. Do not include any explanations.

You MUST:
- Identify EVERY visible food item in the image
- Estimate realistic portion sizes based on visual context
- Provide accurate nutritional estimates for those portions
- Return confidence level (0 to 1) based on image clarity and certainty
- If multiple items exist, estimate total combined nutrition

Return EXACTLY this JSON structure:
{
  "mealName": "descriptive name for the whole meal",
  "portionSize": "estimated total portion (e.g., '1 plate', '250g')",
  "confidence": 0.85,
  "detectedFoods": [
    {
      "name": "food item name",
      "quantity": "estimated quantity",
      "calories": 0,
      "protein": 0,
      "carbohydrates": 0,
      "fat": 0
    }
  ],
  "totalCalories": 0,
  "protein": 0,
  "carbohydrates": 0,
  "fat": 0,
  "fiber": 0,
  "sugar": 0,
  "sodium": 0
}

All numeric values must be numbers (not strings). Nutritional values are in grams unless specified. Sodium is in milligrams. Calories are in kcal.
`.trim();

export class OpenRouterService {
  private client: OpenAI | null = null;
  private readonly modelName = 'google/gemini-2.5-flash'; // High quality vision model on OpenRouter

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = config.openrouterApiKey;
      if (!apiKey) {
        throw ApiError.internal(ERROR_MESSAGES.OPENROUTER.KEY_NOT_CONFIGURED);
      }
      this.client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:5000', // Referer header for OpenRouter compliance
          'X-Title': 'NutriLens',
        },
      });
    }
    return this.client;
  }

  async analyzeFood(imageBuffer: Buffer, mimeType: string): Promise<AiNutritionResultDto> {
    try {
      const client = this.getClient();
      const base64Image = imageBuffer.toString('base64');

      const response = await client.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: NUTRITION_ANALYSIS_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
      });

      const rawText = response.choices[0]?.message?.content ?? '';

      if (!rawText) {
        throw ApiError.internal(ERROR_MESSAGES.OPENROUTER.EMPTY_RESPONSE);
      }

      return this.parseResponse(rawText);
    } catch (error: unknown) {
      if (error instanceof ApiError) throw error;
      const message = error instanceof Error ? error.message : 'Unknown OpenRouter error';
      throw ApiError.internal(ERROR_MESSAGES.MEAL.ANALYSIS_FAILED(message));
    }
  }

  private parseResponse(rawText: string): AiNutritionResultDto {
    try {
      const parsed = JSON.parse(rawText) as AiNutritionResultDto;

      // Validate required fields
      if (
        typeof parsed.mealName !== 'string' ||
        typeof parsed.totalCalories !== 'number' ||
        !Array.isArray(parsed.detectedFoods)
      ) {
        throw new Error('AI response missing required fields');
      }

      return {
        mealName: parsed.mealName,
        portionSize: parsed.portionSize ?? 'unknown',
        confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.7)),
        detectedFoods: parsed.detectedFoods,
        totalCalories: Math.round(parsed.totalCalories ?? 0),
        protein: Math.round(parsed.protein ?? 0),
        carbohydrates: Math.round(parsed.carbohydrates ?? 0),
        fat: Math.round(parsed.fat ?? 0),
        fiber: Math.round(parsed.fiber ?? 0),
        sugar: Math.round(parsed.sugar ?? 0),
        sodium: Math.round(parsed.sodium ?? 0),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Parse error';
      throw ApiError.unprocessable(ERROR_MESSAGES.OPENROUTER.PARSE_FAILED(message));
    }
  }
  async generateInsight(analyticsData: AnalyticsResponseDto): Promise<string> {
    try {
      const client = this.getClient();
      
      const prompt = `
You are an expert nutritionist AI. Review this user's nutrition data for the past period and provide a concise, 3-bullet point summary of their habits and actionable recommendations.
Data:
${JSON.stringify(analyticsData, null, 2)}

Format your response exactly as 3 bullet points starting with a dash (-). Keep it brief, encouraging, and highly specific to the numbers provided. Do not include any intro or outro text. Do not use markdown bolding (asterisks) in your response.
      `.trim();

      const response = await client.chat.completions.create({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content?.trim() || 'No insights could be generated at this time.';
    } catch (error: unknown) {
      console.error('Failed to generate insight:', error);
      return 'AI insights are currently unavailable.';
    }
  }
}
export default OpenRouterService;
