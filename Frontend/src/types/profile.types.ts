export interface UpdateProfileInput {
  fullName: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
}

export interface ProfileResponse {
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
