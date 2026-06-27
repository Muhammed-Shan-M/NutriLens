import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// Aligning interface structure with backend UserResponseDto
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  isOnboarded: boolean;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  fitnessGoal?: 'lose_weight' | 'maintain_weight' | 'gain_muscle';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  bmi?: number;
  bmiCategory?: string;
  bmr?: number;
  tdee?: number;
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupUserData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponseData>;
  signup: (userData: SignupUserData) => Promise<AuthResponseData>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query to fetch the currently authenticated user
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const localToken = localStorage.getItem('nutrilens_access_token');
      if (!localToken) {
        return null;
      }
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data.data;
      } catch (err) {
        // Clear token if user is unauthorised
        localStorage.removeItem('nutrilens_access_token');
        return null;
      }
    },
    retry: false,
    staleTime: Infinity, // Avoid automatic background refetches of current user profile
  });

  // Login mutation
  const loginMutation = useMutation<AuthResponseData, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await axiosInstance.post<{ success: boolean; data: AuthResponseData }>('/auth/login', credentials);
      return res.data.data; // Expected { user, accessToken }
    },
    onSuccess: (data) => {
      localStorage.setItem('nutrilens_access_token', data.accessToken);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });

  // Signup mutation
  const signupMutation = useMutation<AuthResponseData, Error, SignupUserData>({
    mutationFn: async (userData: SignupUserData) => {
      const res = await axiosInstance.post<{ success: boolean; data: AuthResponseData }>('/auth/signup', userData);
      return res.data.data; // Expected { user, accessToken }
    },
    onSuccess: (data) => {
      localStorage.setItem('nutrilens_access_token', data.accessToken);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('nutrilens_access_token');
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Reset all queries to prevent stale data leaks
    },
  });

  const login = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const signup = async (userData: SignupUserData) => {
    return signupMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
