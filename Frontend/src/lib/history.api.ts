import axiosInstance from './axios';
import type { HistoryResponseDto } from '@/types/history.types';

export const getMealHistory = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  dateRange?: string;
  sort?: string;
}): Promise<HistoryResponseDto> => {
  const response = await axiosInstance.get<{ success: boolean; data: HistoryResponseDto }>(
    '/history',
    { params }
  );
  return response.data.data;
};
