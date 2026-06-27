import { IAnalyticsService } from '../interfaces/IAnalyticsService.interface';
import { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository.interface';
import { IUserRepository } from '../../auth/interfaces/IUserRepository.interface';
import { AnalyticsResponseDto, AnalyticsInsightResponseDto } from '../dtos/Analytics.dto';
import { ApiError } from '../../../shared/ApiError';
import OpenRouterService from '../../meal/services/OpenRouterService';

interface DailyAggregation {
  _id: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalSugar: number;
  totalFiber: number;
  totalSodium: number;
  mealCount: number;
}

export class AnalyticsService implements IAnalyticsService {
  private openRouterService = new OpenRouterService();

  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getAnalyticsInsight(userId: string, period: string, customStartDate?: Date, customEndDate?: Date): Promise<AnalyticsInsightResponseDto> {
    const analytics = await this.getAnalytics(userId, period, customStartDate, customEndDate);
    const insight = await this.openRouterService.generateInsight(analytics);
    return { insight };
  }

  async getAnalytics(userId: string, period: string, customStartDate?: Date, customEndDate?: Date): Promise<AnalyticsResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const { startDate, endDate } = this.getDateRange(period, customStartDate, customEndDate);

    // Run aggregations concurrently
    const [dailyData, mealDistData, trackingDates] = await Promise.all([
      this.analyticsRepository.getDailyAggregations(userId, startDate, endDate),
      this.analyticsRepository.getMealDistribution(userId, startDate, endDate),
      this.analyticsRepository.getAllTrackingDates(userId)
    ]);

    // Fill missing dates with zero values for the charts
    const filledDailyData = this.fillMissingDates(dailyData, startDate, endDate);

    // Calculate summaries
    let sumCalories = 0;
    let sumProtein = 0;
    let sumCarbs = 0;
    let sumFat = 0;
    let sumSugar = 0;
    let sumFiber = 0;
    let sumSodium = 0;
    let totalMeals = 0;
    let daysWithMeals = 0;
    let highestCalorieDay: { date: string; calories: number } | null = null;
    let lowestCalorieDay: { date: string; calories: number } | null = null;
    let daysGoalMet = 0;

    const targetCalories = user.dailyCalories || 2000;

    const dailyCaloriesChart = filledDailyData.map(d => {
      // Aggregations skip missing days unless we fill them, filledDailyData handles this
      sumCalories += d.totalCalories;
      sumProtein += d.totalProtein;
      sumCarbs += d.totalCarbohydrates;
      sumFat += d.totalFat;
      sumSugar += d.totalSugar;
      sumFiber += d.totalFiber;
      sumSodium += d.totalSodium;
      totalMeals += d.mealCount;

      if (d.mealCount > 0) {
        daysWithMeals++;
        if (d.totalCalories <= targetCalories) daysGoalMet++;

        if (!highestCalorieDay || d.totalCalories > highestCalorieDay.calories) {
          highestCalorieDay = { date: d._id, calories: d.totalCalories };
        }
        if (!lowestCalorieDay || d.totalCalories < lowestCalorieDay.calories) {
          lowestCalorieDay = { date: d._id, calories: d.totalCalories };
        }
      }

      return {
        date: d._id,
        calories: Math.round(d.totalCalories)
      };
    });

    const macronutrientTrendChart = filledDailyData.map(d => ({
      date: d._id,
      protein: Math.round(d.totalProtein),
      carbohydrates: Math.round(d.totalCarbohydrates),
      fat: Math.round(d.totalFat)
    }));

    const nutritionSummary = {
      averageCalories: daysWithMeals > 0 ? Math.round(sumCalories / daysWithMeals) : 0,
      averageProtein: daysWithMeals > 0 ? Math.round(sumProtein / daysWithMeals) : 0,
      averageCarbohydrates: daysWithMeals > 0 ? Math.round(sumCarbs / daysWithMeals) : 0,
      averageFat: daysWithMeals > 0 ? Math.round(sumFat / daysWithMeals) : 0,
      averageSugar: daysWithMeals > 0 ? Math.round(sumSugar / daysWithMeals) : 0,
      averageFiber: daysWithMeals > 0 ? Math.round(sumFiber / daysWithMeals) : 0,
      averageSodium: daysWithMeals > 0 ? Math.round(sumSodium / daysWithMeals) : 0,
      averageMealsPerDay: daysWithMeals > 0 ? Number((totalMeals / daysWithMeals).toFixed(1)) : 0
    };

    const mealDistribution = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };
    
    const caloriesByMealType = [
      { name: 'Breakfast', calories: 0 },
      { name: 'Lunch', calories: 0 },
      { name: 'Dinner', calories: 0 },
      { name: 'Snack', calories: 0 }
    ];

    mealDistData.forEach(d => {
      const type = d._id as 'breakfast' | 'lunch' | 'dinner' | 'snack';
      if (mealDistribution[type] !== undefined) {
        mealDistribution[type] = d.count;
      }
      const cat = caloriesByMealType.find(c => c.name.toLowerCase() === type);
      if (cat) cat.calories = Math.round(d.totalCalories);
    });

    const goalProgress = {
      daysMet: daysGoalMet,
      totalDays: daysWithMeals,
      percentage: daysWithMeals > 0 ? Math.round((daysGoalMet / daysWithMeals) * 100) : 0
    };

    const { currentStreak, longestStreak } = this.calculateStreaks(trackingDates.map(d => d._id));

    const trends = {
      totalMeals,
      totalCalories: Math.round(sumCalories),
      highestCalorieDay,
      lowestCalorieDay,
      currentStreak,
      longestStreak
    };

    return {
      period,
      dailyCalories: dailyCaloriesChart,
      macronutrientTrend: macronutrientTrendChart,
      macronutrientTotals: {
        protein: Math.round(sumProtein),
        carbohydrates: Math.round(sumCarbs),
        fat: Math.round(sumFat)
      },
      nutritionSummary,
      mealDistribution,
      caloriesByMealType,
      goalProgress,
      trends
    };
  }

  private getDateRange(period: string, customStartDate?: Date, customEndDate?: Date): { startDate: Date, endDate: Date } {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    if (period === 'today') {
      // already set
    } else if (period === '7d') {
      start.setDate(start.getDate() - 6);
    } else if (period === '30d') {
      start.setDate(start.getDate() - 29);
    } else if (period === '90d') {
      start.setDate(start.getDate() - 89);
    } else if (period === 'custom' && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }

    return { startDate: start, endDate: end };
  }

  private fillMissingDates(data: DailyAggregation[], startDate: Date, endDate: Date): DailyAggregation[] {
    const filled = [];
    let current = new Date(startDate);
    
    // Map available data
    const dataMap = new Map();
    data.forEach(d => dataMap.set(d._id, d));

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (dataMap.has(dateStr)) {
        filled.push(dataMap.get(dateStr));
      } else {
        filled.push({
          _id: dateStr,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbohydrates: 0,
          totalFat: 0,
          totalSugar: 0,
          totalFiber: 0,
          totalSodium: 0,
          mealCount: 0
        });
      }
      current.setDate(current.getDate() + 1);
    }
    
    return filled;
  }

  private calculateStreaks(sortedDatesDesc: string[]): { currentStreak: number, longestStreak: number } {
    if (sortedDatesDesc.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    // Remove duplicates just in case
    const uniqueDates = Array.from(new Set(sortedDatesDesc));
    
    let currentStreak = 1;
    let longestStreak = 1;
    let runningStreak = 1;

    // Check if the first date is today or yesterday
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const isCurrentActive = uniqueDates[0] === today || uniqueDates[0] === yesterday;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i+1]);
      const diffTime = Math.abs(d1.getTime() - d2.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        runningStreak++;
        if (i + 1 === runningStreak - 1 && isCurrentActive) {
          currentStreak = runningStreak;
        }
      } else {
        if (runningStreak > longestStreak) longestStreak = runningStreak;
        runningStreak = 1;
      }
    }
    if (runningStreak > longestStreak) longestStreak = runningStreak;
    if (!isCurrentActive) currentStreak = 0;

    return { currentStreak, longestStreak };
  }
}
