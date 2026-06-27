import { IDashboardService } from '../interfaces/IDashboardService.interface';
import { DashboardResponseDto } from '../dtos/Dashboard.dto';
import { IUserRepository } from '../../auth/interfaces/IUserRepository.interface';
import { IMealRepository } from '../../meal/interfaces/IMealRepository.interface';
import { ApiError } from '../../../shared/ApiError';

export class DashboardService implements IDashboardService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mealRepository: IMealRepository
  ) {}

  async getSummary(userId: string): Promise<DashboardResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const todayMeals = await this.mealRepository.findTodayByUserId(userId);

    // Calculate totals
    let consumedCalories = 0;
    let consumedProtein = 0;
    let consumedCarbs = 0;
    let consumedFat = 0;
    let consumedSugar = 0;

    const mappedMeals = todayMeals
      .sort((a, b) => {
        const timeA = a.consumedAt ? a.consumedAt.getTime() : a.createdAt.getTime();
        const timeB = b.consumedAt ? b.consumedAt.getTime() : b.createdAt.getTime();
        return timeB - timeA; // newest first
      })
      .map(meal => {
        consumedCalories += meal.totalCalories || 0;
        consumedProtein += meal.protein || 0;
        consumedCarbs += meal.carbohydrates || 0;
        consumedFat += meal.fat || 0;
        consumedSugar += meal.sugar || 0;

        return {
          id: meal._id.toString(),
          imageUrl: meal.imageUrl || '',
          mealName: meal.mealName,
          mealType: meal.mealType,
          calories: meal.totalCalories || 0,
          protein: meal.protein || 0,
          carbohydrates: meal.carbohydrates || 0,
          fat: meal.fat || 0,
          sugar: meal.sugar || 0,
          time: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(meal.consumedAt || meal.createdAt),
          createdAt: meal.createdAt,
        };
      });

    // Extract targets
    const targetCalories = user.dailyCalories || 0;
    const targetProtein = user.protein || 0;
    const targetCarbs = user.carbs || 0;
    const targetFat = user.fat || 0;

    // Calculate remaining
    const remainingCalories = Math.max(0, targetCalories - consumedCalories);
    const remainingProtein = Math.max(0, targetProtein - consumedProtein);
    const remainingCarbs = Math.max(0, targetCarbs - consumedCarbs);
    const remainingFat = Math.max(0, targetFat - consumedFat);

    // Calculate progress
    const progressCalories = targetCalories > 0 ? Math.min(100, Math.round((consumedCalories / targetCalories) * 100)) : 0;
    const progressProtein = targetProtein > 0 ? Math.min(100, Math.round((consumedProtein / targetProtein) * 100)) : 0;
    const progressCarbs = targetCarbs > 0 ? Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100)) : 0;
    const progressFat = targetFat > 0 ? Math.min(100, Math.round((consumedFat / targetFat) * 100)) : 0;

    const response: DashboardResponseDto = {
      userSummary: {
        fullName: user.fullName || '',
        goal: user.fitnessGoal || user.goal || 'General Health',
        activityLevel: user.activityLevel || 'Not specified',
      },
      nutritionSummary: {
        calories: { target: targetCalories, consumed: consumedCalories, remaining: remainingCalories },
        protein: { target: targetProtein, consumed: consumedProtein, remaining: remainingProtein },
        carbohydrates: { target: targetCarbs, consumed: consumedCarbs, remaining: remainingCarbs },
        fat: { target: targetFat, consumed: consumedFat, remaining: remainingFat },
        sugar: { consumed: consumedSugar },
      },
      progress: {
        calories: progressCalories,
        protein: progressProtein,
        carbohydrates: progressCarbs,
        fat: progressFat,
      },
      todayMeals: mappedMeals,
      healthSummary: {
        bmi: user.bmi || 0,
        bmiCategory: user.bmiCategory || 'Unknown',
        goal: user.fitnessGoal || user.goal || 'General Health',
        activityLevel: user.activityLevel || 'Not specified',
      },
    };

    return response;
  }
}
