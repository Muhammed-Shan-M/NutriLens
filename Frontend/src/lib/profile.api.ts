import axiosInstance from './axios';
import type { ProfileResponse, UpdateProfileInput } from '@/types/profile.types';

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<{ success: boolean; data: ProfileResponse }>('/profile');
  return response.data.data;
};

export const updateProfile = async (data: UpdateProfileInput): Promise<ProfileResponse> => {
  const response = await axiosInstance.patch<{ success: boolean; data: ProfileResponse }>('/profile', data);
  return response.data.data;
};
