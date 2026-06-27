import { DashboardResponseDto } from '../dtos/Dashboard.dto';

export interface IDashboardService {
  getSummary(userId: string): Promise<DashboardResponseDto>;
}
