import { Request, Response, NextFunction } from 'express';
import { IMealService } from '../interfaces/IMealService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';
import { SUCCESS_MESSAGES } from '../../../shared/successMessages.constants';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

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
        return next(ApiError.badRequest(ERROR_MESSAGES.MEAL.IMAGE_REQUIRED));
      }

      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.analyzeMeal(
        userId,
        file.buffer,
        file.mimetype,
        file.originalname
      );

      ApiResponse.success(res, 201, SUCCESS_MESSAGES.MEAL.ANALYZED, result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.createMeal(userId, req.body);
      ApiResponse.success(res, 201, SUCCESS_MESSAGES.MEAL.LOGGED, result);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.getMealHistory(userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.HISTORY_RETRIEVED, result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.getMealById(id, userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.LOG_RETRIEVED, result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.updateMeal(id, userId, req.body);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.LOG_UPDATED, result);
    } catch (error) {
      next(error);
    }
  }

  async getToday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const result = await this.mealService.getTodayMeals(userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.TODAY_FETCHED, result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      await this.mealService.deleteMeal(id, userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.LOG_DELETED);
    } catch (error) {
      next(error);
    }
  }
}
export default MealController;
