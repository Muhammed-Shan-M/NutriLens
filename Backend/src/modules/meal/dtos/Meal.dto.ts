import { MealType } from '../../../shared/enums';
import { IDetectedFood } from '../models/Meal.model';

// ─── Input DTOs ────────────────────────────────────────────────────────────────

export interface AnalyzeMealInputDto {
  userId: string;
  imageBuffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface UpdateMealInputDto {
  mealName?: string;
  mealType?: string;
  totalCalories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}

export interface CreateMealInputDto {
  foodName: string;
  mealType: string;
  calories: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  sugar?: number;
  imageUrl?: string;
  consumedAt?: string;
}

// ─── Internal AI Result ────────────────────────────────────────────────────────

export interface AiDetectedFoodDto {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface AiNutritionResultDto {
  mealName: string;
  detectedFoods: AiDetectedFoodDto[];
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence: number;
  portionSize: string;
}

// ─── Response DTOs ─────────────────────────────────────────────────────────────

export interface MealResponseDto {
  id: string;
  userId: string;
  imageUrl: string;
  mealName: string;
  mealType: MealType;
  detectedFoods: IDetectedFood[];
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence: number;
  aiProvider: string;
  aiModel: string;
  createdAt: Date;
}
