import { Request, Response, NextFunction } from 'express';
import { IAnalyticsService } from '../interfaces/IAnalyticsService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';

export class AnalyticsController {
  constructor(private readonly analyticsService: IAnalyticsService) {}

  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const period = (req.query.period as string) || '7d';
      const customStartDate = req.query.customStartDate ? new Date(req.query.customStartDate as string) : undefined;
      const customEndDate = req.query.customEndDate ? new Date(req.query.customEndDate as string) : undefined;

      const result = await this.analyticsService.getAnalytics(userId, period, customStartDate, customEndDate);

      ApiResponse.success(res, 200, 'Analytics retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };

  getAnalyticsInsight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const period = (req.query.period as string) || '7d';
      const customStartDate = req.query.customStartDate ? new Date(req.query.customStartDate as string) : undefined;
      const customEndDate = req.query.customEndDate ? new Date(req.query.customEndDate as string) : undefined;

      const result = await this.analyticsService.getAnalyticsInsight(userId, period, customStartDate, customEndDate);

      ApiResponse.success(res, 200, 'Analytics insight retrieved successfully.', result);
    } catch (error) {
      next(error);
    }
  };
}
