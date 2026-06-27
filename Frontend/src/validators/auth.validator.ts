import { z } from 'zod';

// Shared Validation Rules
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Login Validator Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Signup/Registration Validator Schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Onboarding Validator Schema
export const onboardingSchema = z.object({
  age: z.coerce.number().min(12, 'Must be at least 12 years old').max(120, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.coerce.number().min(30, 'Weight must be at least 30kg').max(300, 'Invalid weight'),
  height: z.coerce.number().min(100, 'Height must be at least 100cm').max(250, 'Invalid height'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
  goal: z.enum(['lose_weight', 'maintain_weight', 'gain_weight']),
});

// Infer Schema Types for TypeScript DTO support
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type OnboardingInputSchema = z.input<typeof onboardingSchema>;
export type OnboardingOutputSchema = z.output<typeof onboardingSchema>;
