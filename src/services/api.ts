import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response) {
      // Server responded with error
      apiError.message = error.response.data?.message || error.message;
      apiError.code = error.response.data?.code;
      apiError.details = error.response.data?.details;
      apiError.status = error.response.status;

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        apiError.message = 'You do not have permission to perform this action';
      } else if (error.response.status === 404) {
        apiError.message = 'The requested resource was not found';
      } else if (error.response.status === 422) {
        apiError.message = 'Validation error occurred';
      } else if (error.response.status >= 500) {
        apiError.message = 'Server error occurred. Please try again later';
      }
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'No response from server. Please check your connection';
    } else {
      // Error in request setup
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;

// Helper function to simulate API delay for mock data
export const simulateApiDelay = <T>(dataOrCallback: T | (() => T), delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = typeof dataOrCallback === 'function' ? (dataOrCallback as () => T)() : dataOrCallback;
      resolve(data);
    }, delay);
  });
};

// Helper function to create paginated response
export const createPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
};
