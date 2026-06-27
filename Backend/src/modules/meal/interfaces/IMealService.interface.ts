import { MealResponseDto, UpdateMealInputDto, CreateMealInputDto } from '../dtos/Meal.dto';

export interface IMealService {
  analyzeMeal(
    userId: string,
    imageBuffer: Buffer,
    mimeType: string,
    originalName: string
  ): Promise<MealResponseDto>;
  updateMeal(
    id: string,
    userId: string,
    data: UpdateMealInputDto
  ): Promise<MealResponseDto>;
  getTodayMeals(userId: string): Promise<MealResponseDto[]>;
  createMeal(userId: string, data: CreateMealInputDto): Promise<MealResponseDto>;
  getMealHistory(userId: string): Promise<MealResponseDto[]>;
  getMealById(id: string, userId: string): Promise<MealResponseDto>;
  deleteMeal(id: string, userId: string): Promise<void>;
}
