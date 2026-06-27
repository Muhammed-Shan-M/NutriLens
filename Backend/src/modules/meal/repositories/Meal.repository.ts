import { IMealRepository } from '../interfaces/IMealRepository.interface';
import { IMealDocument, MealModel } from '../models/Meal.model';
import { ApiError } from '../../../shared/ApiError';

export class MealRepository implements IMealRepository {
  async create(data: Partial<IMealDocument>): Promise<IMealDocument> {
    try {
      const meal = new MealModel(data);
      return await meal.save();
    } catch (error) {
      throw ApiError.internal('Failed to save meal to database.');
    }
  }

  async findById(id: string): Promise<IMealDocument | null> {
    try {
      return await MealModel.findById(id).lean<IMealDocument>();
    } catch (error) {
      throw ApiError.internal('Failed to fetch meal.');
    }
  }

  async findByUserId(userId: string, limit = 50): Promise<IMealDocument[]> {
    try {
      return await MealModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean<IMealDocument[]>();
    } catch (error) {
      throw ApiError.internal('Failed to fetch meal history.');
    }
  }

  async findTodayByUserId(userId: string): Promise<IMealDocument[]> {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      return await MealModel.find({
        userId,
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      })
        .sort({ createdAt: -1 })
        .lean<IMealDocument[]>();
    } catch (error) {
      throw ApiError.internal('Failed to fetch today\'s meals.');
    }
  }

  async update(id: string, data: Partial<IMealDocument>): Promise<IMealDocument | null> {
    try {
      return await MealModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    } catch (error) {
      throw ApiError.internal('Failed to update meal record.');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await MealModel.findByIdAndDelete(id);
    } catch (error) {
      throw ApiError.internal('Failed to delete meal.');
    }
  }
}
