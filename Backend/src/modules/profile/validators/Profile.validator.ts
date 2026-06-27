import { z } from 'zod';
import { ActivityLevel, FitnessGoal } from '../../../shared/enums';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, ERROR_MESSAGES.VALIDATION.FULL_NAME_MIN).max(50, ERROR_MESSAGES.VALIDATION.FULL_NAME_MAX),
  age: z.number().int(ERROR_MESSAGES.VALIDATION.AGE_INT).min(12, ERROR_MESSAGES.VALIDATION.AGE_MIN_PROFILE).max(120, ERROR_MESSAGES.VALIDATION.AGE_MAX_PROFILE),
  height: z.number().min(100, ERROR_MESSAGES.VALIDATION.HEIGHT_MIN_PROFILE).max(250, ERROR_MESSAGES.VALIDATION.HEIGHT_MAX_PROFILE),
  weight: z.number().min(30, ERROR_MESSAGES.VALIDATION.WEIGHT_MIN_PROFILE).max(300, ERROR_MESSAGES.VALIDATION.WEIGHT_MAX_PROFILE),
  activityLevel: z.nativeEnum(ActivityLevel, {
    error: ERROR_MESSAGES.VALIDATION.ACTIVITY_LEVEL_INVALID
  }),
  goal: z.nativeEnum(FitnessGoal, {
    error: ERROR_MESSAGES.VALIDATION.FITNESS_GOAL_INVALID
  })
});
