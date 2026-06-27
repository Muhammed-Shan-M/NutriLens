import mongoose from 'mongoose';
import { IMealDocument } from '../models/Meal.model';
import { MealResponseDto } from '../dtos/Meal.dto';
import { MealType } from '../../../shared/enums';

export class MealMapper {
  static toResponseDto(meal: IMealDocument): MealResponseDto {
    return {
      id: (meal._id as mongoose.Types.ObjectId).toString(),
      userId: meal.userId.toString(),
      imageUrl: meal.imageUrl,
      mealName: meal.mealName,
      mealType: meal.mealType as MealType,
      detectedFoods: meal.detectedFoods,
      totalCalories: meal.totalCalories,
      protein: meal.protein,
      carbohydrates: meal.carbohydrates,
      fat: meal.fat,
      fiber: meal.fiber,
      sugar: meal.sugar,
      sodium: meal.sodium,
      confidence: meal.confidence,
      aiProvider: meal.aiProvider,
      aiModel: meal.aiModel,
      createdAt: meal.createdAt,
    };
  }
}
