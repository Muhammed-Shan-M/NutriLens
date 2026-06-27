import { Types } from 'mongoose';
import { MealModel } from '../../meal/models/Meal.model';
import { IAnalyticsRepository, DailyAggregationResult, MealDistributionResult } from '../interfaces/IAnalyticsRepository.interface';
import { ApiError } from '../../../shared/ApiError';

export class AnalyticsRepository implements IAnalyticsRepository {
  
  async getDailyAggregations(userId: string, startDate: Date, endDate: Date): Promise<DailyAggregationResult[]> {
    try {
      const results = await MealModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            // Group by formatted date YYYY-MM-DD using timezone if necessary, we'll use UTC for simplicity
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            totalCalories: { $sum: "$totalCalories" },
            totalProtein: { $sum: "$protein" },
            totalCarbohydrates: { $sum: "$carbohydrates" },
            totalFat: { $sum: "$fat" },
            totalSugar: { $sum: "$sugar" },
            totalFiber: { $sum: "$fiber" },
            totalSodium: { $sum: "$sodium" },
            mealCount: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 } // Sort chronologically
        }
      ]);
      return results;
    } catch (error) {
      throw ApiError.internal('Failed to aggregate daily nutrition data.');
    }
  }

  async getMealDistribution(userId: string, startDate: Date, endDate: Date): Promise<MealDistributionResult[]> {
    try {
      const results = await MealModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$mealType",
            count: { $sum: 1 },
            totalCalories: { $sum: "$totalCalories" }
          }
        }
      ]);
      return results;
    } catch (error) {
      throw ApiError.internal('Failed to aggregate meal distribution.');
    }
  }

  async getAllTrackingDates(userId: string): Promise<{ _id: string }[]> {
    try {
      const results = await MealModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId)
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            }
          }
        },
        {
          $sort: { _id: -1 } // Newest first
        }
      ]);
      return results;
    } catch (error) {
      throw ApiError.internal('Failed to aggregate tracking dates for streak.');
    }
  }
}
