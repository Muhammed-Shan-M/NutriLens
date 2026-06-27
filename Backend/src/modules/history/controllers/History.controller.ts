import { Request, Response, NextFunction } from 'express';
import { HistoryService } from '../services/History.service';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';
import { SUCCESS_MESSAGES } from '../../../shared/successMessages.constants';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

export class HistoryController {
  constructor(private readonly historyService: HistoryService) {
    this.getHistory = this.getHistory.bind(this);
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const query = req.query as {
        page?: string;
        limit?: string;
        search?: string;
        type?: string;
        dateRange?: string;
        sort?: string;
      };

      const history = await this.historyService.getHistory(userId, query);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.MEAL.HISTORY_RETRIEVED, history);
    } catch (error) {
      next(error);
    }
  }
}
