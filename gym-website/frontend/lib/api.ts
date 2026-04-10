// API client for communicating with the Express backend
import axios from 'axios';

// Base URL from environment variable or default to local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - adds auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Request new access token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: (data: SignupData) => api.post('/auth/signup', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Workouts API functions
export const workoutsAPI = {
  getAll: (params?: WorkoutFilters) => api.get('/workouts', { params }),
  getById: (id: string) => api.get(`/workouts/${id}`),
  getWeeklyPlan: (difficulty?: string) => api.get('/workouts/weekly-plan', { params: { difficulty } }),
  saveWorkout: (id: string) => api.post(`/workouts/${id}/save`),
  getSaved: () => api.get('/workouts/user/saved'),
};

// Diet API functions
export const dietAPI = {
  getAll: (params?: DietFilters) => api.get('/diet', { params }),
  getById: (id: string) => api.get(`/diet/${id}`),
  getByGoal: (goal: string) => api.get(`/diet/goal/${goal}`),
};

// Calculator API functions
export const calculatorAPI = {
  calculateTDEE: (data: TDEEInput) => api.post('/calculator/tdee', data),
  calculateBMI: (data: BMIInput) => api.post('/calculator/bmi', data),
};

// Progress API functions
export const progressAPI = {
  log: (data: ProgressData) => api.post('/progress', data),
  getAll: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
    api.get('/progress', { params }),
  delete: (id: string) => api.delete(`/progress/${id}`),
};

// User API functions
export const userAPI = {
  updateProfile: (data: Partial<UserProfile>) => api.put('/user/profile', data),
  changePassword: (data: ChangePasswordData) => api.put('/user/password', data),
  deleteAccount: () => api.delete('/user'),
};

// TypeScript interfaces
export interface SignupData {
  name: string;
  email: string;
  password: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface WorkoutFilters {
  difficulty?: string;
  day?: string;
  category?: string;
  muscleGroup?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DietFilters {
  goal?: string;
  difficulty?: string;
  search?: string;
}

export interface TDEEInput {
  age: number;
  height: number;
  weight: number;
  gender: string;
  activityLevel: string;
  goal: string;
  heightUnit?: string;
  weightUnit?: string;
}

export interface BMIInput {
  height: number;
  weight: number;
  heightUnit?: string;
  weightUnit?: string;
}

export interface ProgressData {
  date?: string;
  weight: number;
  bodyFatPercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    calves?: number;
  };
  caloriesConsumed?: number;
  caloriesBurned?: number;
  notes?: string;
  mood?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  activityLevel: string;
  goal: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export default api;
