import axiosInstance from './axios';
import type { MealResponseDto } from '@/types/meal.types';

export const analyzeMeal = async (file: File): Promise<MealResponseDto> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post<{ success: boolean; data: MealResponseDto }>(
    '/meals/analyze',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Increase timeout for AI analysis (up to 60s)
      timeout: 60000,
    }
  );

  return response.data.data;
};

export const getTodayMeals = async (): Promise<MealResponseDto[]> => {
  const response = await axiosInstance.get<{ success: boolean; data: MealResponseDto[] }>(
    '/meals/today'
  );
  return response.data.data;
};

export const updateMeal = async (id: string, data: Partial<MealResponseDto>): Promise<MealResponseDto> => {
  const response = await axiosInstance.put<{ success: boolean; data: MealResponseDto }>(
    `/meals/${id}`,
    data
  );
  return response.data.data;
};
