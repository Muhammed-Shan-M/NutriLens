import { z } from 'zod';

// Signup Body Validation Schema
export const signupSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string()
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  }),
});

// Login Body Validation Schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required'),
  }),
});

// Onboarding Metrics Update Body Validation Schema (Required fields during onboarding)
export const updateMetricsSchema = z.object({
  body: z.object({
    age: z
      .number()
      .min(12, 'Age must be at least 12')
      .max(120, 'Age cannot exceed 120'),
    gender: z
      .enum(['male', 'female', 'other']),
    weight: z
      .number()
      .min(30, 'Weight must be at least 30kg')
      .max(300, 'Weight cannot exceed 300kg'),
    height: z
      .number()
      .min(100, 'Height must be at least 100cm')
      .max(250, 'Height cannot exceed 250cm'),
    activityLevel: z
      .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
    goal: z
      .enum(['lose_weight', 'maintain_weight', 'gain_weight']),
  }),
});

// Aliases for compatibility
export const registerSchema = signupSchema;

export default { signupSchema, loginSchema, updateMetricsSchema, registerSchema };
