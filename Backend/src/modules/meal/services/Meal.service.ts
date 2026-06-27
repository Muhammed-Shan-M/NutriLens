import mongoose from 'mongoose';
import { IMealService } from '../interfaces/IMealService.interface';
import { IMealRepository } from '../interfaces/IMealRepository.interface';
import { MealResponseDto, UpdateMealInputDto, CreateMealInputDto } from '../dtos/Meal.dto';
import { MealMapper } from '../mappers/Meal.mapper';
import { OpenRouterService } from './OpenRouterService';
import { CloudinaryService } from './CloudinaryService';
import { ApiError } from '../../../shared/ApiError';

export class MealService implements IMealService {
  private readonly openRouterService: OpenRouterService;
  private readonly cloudinaryService: CloudinaryService;

  constructor(private readonly mealRepository: IMealRepository) {
    this.openRouterService = new OpenRouterService();
    this.cloudinaryService = new CloudinaryService();
  }

  async analyzeMeal(
    userId: string,
    imageBuffer: Buffer,
    mimeType: string,
    originalName: string
  ): Promise<MealResponseDto> {
    // ── Step 1: OpenRouter AI Analysis ─────────────────────────────────────────────
    // If AI fails, we throw immediately — no Cloudinary upload, no DB record
    const nutritionResult = await this.openRouterService.analyzeFood(imageBuffer, mimeType);

    // ── Step 2: Upload Image to Cloudinary ─────────────────────────────────────
    let cloudinaryResult: { url: string; secureUrl: string; publicId: string };
    try {
      cloudinaryResult = await this.cloudinaryService.uploadBuffer(imageBuffer, mimeType);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Cloudinary upload failed';
      throw ApiError.internal(`Image storage failed after analysis: ${message}`);
    }

    // ── Step 3: Persist Meal to MongoDB ───────────────────────────────────────
    let savedMeal;
    try {
      savedMeal = await this.mealRepository.create({
        userId: new mongoose.Types.ObjectId(userId),
        imageUrl: cloudinaryResult.secureUrl,
        cloudinaryPublicId: cloudinaryResult.publicId,
        mealName: nutritionResult.mealName,
        detectedFoods: nutritionResult.detectedFoods,
        totalCalories: nutritionResult.totalCalories,
        protein: nutritionResult.protein,
        carbohydrates: nutritionResult.carbohydrates,
        fat: nutritionResult.fat,
        fiber: nutritionResult.fiber,
        sugar: nutritionResult.sugar,
        sodium: nutritionResult.sodium,
        confidence: nutritionResult.confidence,
        aiProvider: 'openrouter',
        aiModel: 'google/gemini-2.5-flash',
        rawAiResponse: JSON.stringify(nutritionResult),
      });
    } catch (error: unknown) {
      // Cleanup: delete the Cloudinary image since DB save failed
      await this.cloudinaryService.deleteImage(cloudinaryResult.publicId);
      const message = error instanceof Error ? error.message : 'Database save failed';
      throw ApiError.internal(`Failed to record meal: ${message}`);
    }

    return MealMapper.toResponseDto(savedMeal);
  }

  async updateMeal(id: string, userId: string, data: UpdateMealInputDto): Promise<MealResponseDto> {
    const meal = await this.mealRepository.findById(id);
    if (!meal) {
      throw ApiError.notFound('Meal log not found.');
    }

    if (meal.userId.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to update this meal log.');
    }

    // Update properties
    const updatedData: Partial<UpdateMealInputDto> = {};
    if (data.mealName !== undefined) updatedData.mealName = data.mealName;
    if (data.mealType !== undefined) updatedData.mealType = data.mealType;
    if (data.totalCalories !== undefined) updatedData.totalCalories = data.totalCalories;
    if (data.protein !== undefined) updatedData.protein = data.protein;
    if (data.carbohydrates !== undefined) updatedData.carbohydrates = data.carbohydrates;
    if (data.fat !== undefined) updatedData.fat = data.fat;
    if (data.sugar !== undefined) updatedData.sugar = data.sugar;
    if (data.sodium !== undefined) updatedData.sodium = data.sodium;
    if (data.fiber !== undefined) updatedData.fiber = data.fiber;

    const updatedMeal = await this.mealRepository.update(id, updatedData);
    if (!updatedMeal) {
      throw ApiError.internal('Failed to update meal log.');
    }

    return MealMapper.toResponseDto(updatedMeal);
  }

  async getTodayMeals(userId: string): Promise<MealResponseDto[]> {
    const meals = await this.mealRepository.findTodayByUserId(userId);
    return meals.map((meal) => MealMapper.toResponseDto(meal));
  }

  async createMeal(userId: string, data: CreateMealInputDto): Promise<MealResponseDto> {
    const consumedAt = data.consumedAt ? new Date(data.consumedAt) : new Date();

    const savedMeal = await this.mealRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      imageUrl: data.imageUrl || '',
      cloudinaryPublicId: '',
      mealName: data.foodName,
      mealType: data.mealType,
      detectedFoods: [],
      totalCalories: Number(data.calories),
      protein: Number(data.protein || 0),
      carbohydrates: Number(data.carbohydrates || 0),
      fat: Number(data.fat || 0),
      sugar: Number(data.sugar || 0),
      confidence: 0,
      aiProvider: 'none',
      aiModel: 'none',
      consumedAt,
    });

    return MealMapper.toResponseDto(savedMeal);
  }

  async getMealHistory(userId: string): Promise<MealResponseDto[]> {
    const meals = await this.mealRepository.findByUserId(userId, 500);
    return meals.map((meal) => MealMapper.toResponseDto(meal));
  }

  async getMealById(id: string, userId: string): Promise<MealResponseDto> {
    const meal = await this.mealRepository.findById(id);
    if (!meal) {
      throw ApiError.notFound('Meal log not found.');
    }

    if (meal.userId.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to view this meal log.');
    }

    return MealMapper.toResponseDto(meal);
  }

  async deleteMeal(id: string, userId: string): Promise<void> {
    const meal = await this.mealRepository.findById(id);
    if (!meal) {
      throw ApiError.notFound('Meal log not found.');
    }

    if (meal.userId.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to delete this meal log.');
    }

    if (meal.cloudinaryPublicId) {
      await this.cloudinaryService.deleteImage(meal.cloudinaryPublicId);
    }

    await this.mealRepository.delete(id);
  }
}
