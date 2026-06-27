import { z } from 'zod';
import { MealType } from '../../../shared/enums';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

// Schema for manual logging of a meal (POST /api/meals)
export const createMealSchema = z.object({
  body: z.object({
    mealType: z.nativeEnum(MealType),
    foodName: z.string().min(1, ERROR_MESSAGES.VALIDATION.FOOD_NAME_REQUIRED),
    calories: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.CALORIES_POSITIVE),
    protein: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.PROTEIN_POSITIVE).optional(),
    carbohydrates: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.CARBS_POSITIVE).optional(),
    fat: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.FAT_POSITIVE).optional(),
    sugar: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.SUGAR_POSITIVE).optional(),
    estimatedWeight: z.string().optional(),
    imageUrl: z.string().optional(),
    consumedAt: z.string().optional(), // ISO Date String
  }),
});

// Schema for updating a meal (PUT /api/meals/:id)
export const updateMealSchema = z.object({
  body: z.object({
    mealName: z.string().min(1, ERROR_MESSAGES.VALIDATION.FOOD_NAME_REQUIRED).optional(),
    mealType: z.nativeEnum(MealType).optional(),
    totalCalories: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.CALORIES_POSITIVE).optional(),
    protein: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.PROTEIN_POSITIVE).optional(),
    carbohydrates: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.CARBS_POSITIVE).optional(),
    fat: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.FAT_POSITIVE).optional(),
    sugar: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.SUGAR_POSITIVE).optional(),
    fiber: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.FIBER_POSITIVE).optional(),
    sodium: z.number().nonnegative(ERROR_MESSAGES.VALIDATION.SODIUM_POSITIVE).optional(),
    consumedAt: z.string().optional(),
  }),
});

export default {
  createMealSchema,
  updateMealSchema,
};
