import { z } from 'zod';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

// Signup Body Validation Schema
export const signupSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, ERROR_MESSAGES.VALIDATION.NAME_MIN)
      .max(50, ERROR_MESSAGES.VALIDATION.NAME_MAX),
    email: z
      .string()
      .email(ERROR_MESSAGES.VALIDATION.EMAIL_INVALID),
    password: z
      .string()
      .min(8, ERROR_MESSAGES.VALIDATION.PASSWORD_MIN),
  }),
});

// Login Body Validation Schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email(ERROR_MESSAGES.VALIDATION.EMAIL_INVALID),
    password: z
      .string()
      .min(1, ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED),
  }),
});

// Onboarding Metrics Update Body Validation Schema (Required fields during onboarding)
export const updateMetricsSchema = z.object({
  body: z.object({
    age: z
      .number()
      .min(12, ERROR_MESSAGES.VALIDATION.AGE_MIN)
      .max(120, ERROR_MESSAGES.VALIDATION.AGE_MAX),
    gender: z
      .enum(['male', 'female', 'other']),
    weight: z
      .number()
      .min(30, ERROR_MESSAGES.VALIDATION.WEIGHT_MIN)
      .max(300, ERROR_MESSAGES.VALIDATION.WEIGHT_MAX),
    height: z
      .number()
      .min(100, ERROR_MESSAGES.VALIDATION.HEIGHT_MIN)
      .max(250, ERROR_MESSAGES.VALIDATION.HEIGHT_MAX),
    activityLevel: z
      .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
    goal: z
      .enum(['lose_weight', 'maintain_weight', 'gain_weight']),
  }),
});

// Aliases for compatibility
export const registerSchema = signupSchema;

export default { signupSchema, loginSchema, updateMetricsSchema, registerSchema };
