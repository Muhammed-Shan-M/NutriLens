import { z } from 'zod';
import { MealType } from '../../../shared/enums';

// Schema for manual logging of a meal (POST /api/meals)
export const createMealSchema = z.object({
  body: z.object({
    mealType: z.nativeEnum(MealType),
    foodName: z.string().min(1, 'Food name is required'),
    calories: z.number().nonnegative('Calories must be a valid positive number'),
    protein: z.number().nonnegative('Protein must be a valid positive number').optional(),
    carbohydrates: z.number().nonnegative('Carbohydrates must be a valid positive number').optional(),
    fat: z.number().nonnegative('Fat must be a valid positive number').optional(),
    sugar: z.number().nonnegative('Sugar must be a valid positive number').optional(),
    estimatedWeight: z.string().optional(),
    imageUrl: z.string().optional(),
    consumedAt: z.string().optional(), // ISO Date String
  }),
});

// Schema for updating a meal (PUT /api/meals/:id)
export const updateMealSchema = z.object({
  body: z.object({
    mealName: z.string().min(1, 'Food name is required').optional(),
    mealType: z.nativeEnum(MealType).optional(),
    totalCalories: z.number().nonnegative('Calories must be a valid positive number').optional(),
    protein: z.number().nonnegative('Protein must be a valid positive number').optional(),
    carbohydrates: z.number().nonnegative('Carbohydrates must be a valid positive number').optional(),
    fat: z.number().nonnegative('Fat must be a valid positive number').optional(),
    sugar: z.number().nonnegative('Sugar must be a valid positive number').optional(),
    fiber: z.number().nonnegative('Fiber must be a valid positive number').optional(),
    sodium: z.number().nonnegative('Sodium must be a valid positive number').optional(),
    consumedAt: z.string().optional(),
  }),
});

export default {
  createMealSchema,
  updateMealSchema,
};
