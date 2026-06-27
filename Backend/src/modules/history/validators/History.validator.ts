import { z } from 'zod';
import { MealType } from '../../../shared/enums';

export const getHistoryQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    type: z.enum([MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK, 'all'] as [MealType, MealType, MealType, MealType, 'all']).optional(),
    dateRange: z.enum(['today', '7days', '30days', 'all']).optional(),
    sort: z.enum(['newest', 'oldest', 'calories_high', 'calories_low']).optional(),
  }),
});
