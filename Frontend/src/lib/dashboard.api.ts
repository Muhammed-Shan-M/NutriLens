import axiosInstance from './axios';
import type { DashboardResponseDto } from '@/types/dashboard.types';

export const getDashboardSummary = async (): Promise<DashboardResponseDto> => {
  const response = await axiosInstance.get<{ success: boolean; data: DashboardResponseDto }>(
    '/dashboard/summary'
  );
  return response.data.data;
};
