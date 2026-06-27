import { z } from 'zod';
import { ActivityLevel, FitnessGoal } from '../../../shared/enums';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name cannot exceed 50 characters'),
  age: z.number().int('Age must be a whole number').min(12, 'Age must be at least 12').max(120, 'Age cannot exceed 120'),
  height: z.number().min(100, 'Height must be at least 100 cm').max(250, 'Height cannot exceed 250 cm'),
  weight: z.number().min(30, 'Weight must be at least 30 kg').max(300, 'Weight cannot exceed 300 kg'),
  activityLevel: z.nativeEnum(ActivityLevel, {
    error: 'Invalid activity level selected'
  }),
  goal: z.nativeEnum(FitnessGoal, {
    error: 'Invalid fitness goal selected'
  })
});
