import { AnalyticsResponseDto, AnalyticsInsightResponseDto } from '../dtos/Analytics.dto';

export interface IAnalyticsService {
  getAnalytics(userId: string, period: string, startDate?: Date, endDate?: Date): Promise<AnalyticsResponseDto>;
  getAnalyticsInsight(userId: string, period: string, customStartDate?: Date, customEndDate?: Date): Promise<AnalyticsInsightResponseDto>;
}
