import axiosInstance from './axios';
import type { AnalyticsResponseDto } from '@/types/analytics.types';

export const getAnalytics = async (
  period: string = '7d',
  customStartDate?: string,
  customEndDate?: string
): Promise<AnalyticsResponseDto> => {
  const params = new URLSearchParams({ period });
  if (customStartDate) params.append('customStartDate', customStartDate);
  if (customEndDate) params.append('customEndDate', customEndDate);

  const response = await axiosInstance.get<{ success: boolean; data: AnalyticsResponseDto }>(
    `/analytics?${params.toString()}`
  );
  return response.data.data;
};

export const getAnalyticsInsight = async (
  period: string = '7d',
  customStartDate?: string,
  customEndDate?: string
): Promise<string> => {
  const params = new URLSearchParams({ period });
  if (customStartDate) params.append('customStartDate', customStartDate);
  if (customEndDate) params.append('customEndDate', customEndDate);

  const response = await axiosInstance.get<{ success: boolean; data: { insight: string } }>(
    `/analytics/insight?${params.toString()}`
  );
  return response.data.data.insight;
};
