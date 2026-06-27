import axios from 'axios';
import { queryClient } from './queryClient';

// Get base URL from environment variables, fallback to local default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow cookies for refresh tokens
});

// Request Interceptor: Attach bearer token if stored in local storage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nutrilens_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lock to prevent multiple simultaneous refresh requests
interface FailedRequestQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Catch generic API errors and handle unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error status is 401 (Unauthorized) and has not been retried yet
    const status = error.response?.status || error.status;
    if (status === 401 && originalRequest && !originalRequest._retry) {
      
      // If the request was for refresh token, login, or signup, do not attempt to refresh
      const url = originalRequest.url || '';
      if (url.includes('/auth/refresh-token') || url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/register')) {
        const apiError = {
          message: error.response?.data?.message || 'An unexpected error occurred.',
          status: status || 500,
          errors: error.response?.data?.errors || null,
        };
        return Promise.reject(apiError);
      }
      
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // Trigger silent token refresh request to endpoint
        const res = await axiosInstance.post('/auth/refresh-token');
        const { accessToken } = res.data.data;

        // Save new access token into local storage
        localStorage.setItem('nutrilens_access_token', accessToken);
        
        // Update authorization headers
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear local storage and clear currentUser cache
        localStorage.removeItem('nutrilens_access_token');
        queryClient.setQueryData(['currentUser'], null);

        // Redirect user to sign in page
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Standardize error formats
    const apiError = {
      message: error.response?.data?.message || 'An unexpected error occurred.',
      status: status || 500,
      errors: error.response?.data?.errors || null,
    };

    return Promise.reject(apiError);
  }
);

export default axiosInstance;
