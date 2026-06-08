import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SecureStorage } from '@/utils/storage';

// In a real production environment, use environment variables (e.g. process.env.EXPO_PUBLIC_API_URL)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token if present
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle global failures (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Check if error is due to expired token (401 Unauthorized)
    if (error.response?.status === 401 && originalRequest) {
      // Handle automatic logout or token refresh flow here
      console.warn('Unauthorized access - potential token expiration');
      await SecureStorage.removeItem('access_token');
      // For example, redirect to login screen, or dispatch a logout action.
    }

    // Format the API error message
    const apiError = {
      message: 'An unexpected error occurred.',
      status: error.response?.status,
      errors: undefined as Record<string, string[]> | undefined,
    };

    if (error.response && error.response.data) {
      const responseData = error.response.data as any;
      apiError.message = responseData.message || apiError.message;
      apiError.errors = responseData.errors;
    } else if (error.request) {
      apiError.message = 'No response received from server. Please check your network connection.';
    } else {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);
