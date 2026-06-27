import { Request, Response, NextFunction } from 'express';
import { IMealService } from '../interfaces/IMealService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';

export class MealController {
  constructor(private readonly mealService: IMealService) {
    this.analyze = this.analyze.bind(this);
    this.update = this.update.bind(this);
    this.getToday = this.getToday.bind(this);
    this.create = this.create.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.getById = this.getById.bind(this);
    this.delete = this.delete.bind(this);
  }

  async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        return next(ApiError.badRequest('No image file provided. Please upload a JPEG, PNG, or WEBP image.'));
      }

      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.analyzeMeal(
        userId,
        file.buffer,
        file.mimetype,
        file.originalname
      );

      ApiResponse.success(res, 201, 'Meal analyzed and saved successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.createMeal(userId, req.body);
      ApiResponse.success(res, 201, 'Meal logged successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.getMealHistory(userId);
      ApiResponse.success(res, 200, 'Meal history retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.getMealById(id, userId);
      ApiResponse.success(res, 200, 'Meal log retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.updateMeal(id, userId, req.body);
      ApiResponse.success(res, 200, 'Meal log updated successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async getToday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const result = await this.mealService.getTodayMeals(userId);
      ApiResponse.success(res, 200, 'Today\'s meals fetched successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      await this.mealService.deleteMeal(id, userId);
      ApiResponse.success(res, 200, 'Meal log deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
export default MealController;
