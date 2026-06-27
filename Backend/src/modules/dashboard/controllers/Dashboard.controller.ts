import { Request, Response, NextFunction } from 'express';
import { IDashboardService } from '../interfaces/IDashboardService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';

export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) {
    this.getSummary = this.getSummary.bind(this);
  }

  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized('Authentication required.'));
      }

      const summary = await this.dashboardService.getSummary(userId);
      ApiResponse.success(res, 200, 'Dashboard summary retrieved successfully.', summary);
    } catch (error) {
      next(error);
    }
  }
}
