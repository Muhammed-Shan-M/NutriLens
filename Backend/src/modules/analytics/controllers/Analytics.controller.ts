import { Request, Response, NextFunction } from 'express';
import { IAnalyticsService } from '../interfaces/IAnalyticsService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';
import { SUCCESS_MESSAGES } from '../../../shared/successMessages.constants';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

export class AnalyticsController {
  constructor(private readonly analyticsService: IAnalyticsService) {}

  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const period = (req.query.period as string) || '7d';
      const customStartDate = req.query.customStartDate ? new Date(req.query.customStartDate as string) : undefined;
      const customEndDate = req.query.customEndDate ? new Date(req.query.customEndDate as string) : undefined;

      const result = await this.analyticsService.getAnalytics(userId, period, customStartDate, customEndDate);

      ApiResponse.success(res, 200, SUCCESS_MESSAGES.ANALYTICS.RETRIEVED, result);
    } catch (error) {
      next(error);
    }
  };

  getAnalyticsInsight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const period = (req.query.period as string) || '7d';
      const customStartDate = req.query.customStartDate ? new Date(req.query.customStartDate as string) : undefined;
      const customEndDate = req.query.customEndDate ? new Date(req.query.customEndDate as string) : undefined;

      const result = await this.analyticsService.getAnalyticsInsight(userId, period, customStartDate, customEndDate);

      ApiResponse.success(res, 200, SUCCESS_MESSAGES.ANALYTICS.INSIGHT_RETRIEVED, result);
    } catch (error) {
      next(error);
    }
  };
}
