import { FilterQuery } from 'mongoose';
import { MealModel, IMealDocument } from '../../meal/models/Meal.model';

export interface HistoryQueryOptions {
  userId: string;
  limit: number;
  skip: number;
  sortField: string;
  sortOrder: 1 | -1;
  search?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export class HistoryRepository {
  async findPaginatedMeals(options: HistoryQueryOptions): Promise<{ data: IMealDocument[]; total: number }> {
    const { userId, limit, skip, sortField, sortOrder, search, type, startDate, endDate } = options;

    const query: FilterQuery<IMealDocument> = { userId };

    if (search) {
      query.$or = [
        { mealName: { $regex: search, $options: 'i' } },
        { 'detectedFoods.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'all') {
      query.mealType = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const [data, total] = await Promise.all([
      MealModel.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      MealModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }
}
