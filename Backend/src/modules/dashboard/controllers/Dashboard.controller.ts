import { Request, Response, NextFunction } from 'express';
import { IDashboardService } from '../interfaces/IDashboardService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';
import { SUCCESS_MESSAGES } from '../../../shared/successMessages.constants';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) {
    this.getSummary = this.getSummary.bind(this);
  }

  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const summary = await this.dashboardService.getSummary(userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.DASHBOARD.RETRIEVED, summary);
    } catch (error) {
      next(error);
    }
  }
}
