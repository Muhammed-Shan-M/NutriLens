import { ActivityLevel, FitnessGoal } from '../../../shared/enums';

export interface UpdateProfileInputDto {
  fullName: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
}

export interface ProfileResponseDto {
  id: string;
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goal?: string;
  bmi?: number;
  bmiCategory?: string;
  bmr?: number;
  tdee?: number;
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt: string;
  updatedAt: string;
}
