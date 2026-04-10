// Authentication utilities using Zustand for state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
}

// Auth store state interface
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Zustand store with persistence to localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) =>
        set({ user, isAuthenticated: true }),

      setTokens: (accessToken: string, refreshToken: string) => {
        // Store tokens in localStorage for API interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ accessToken, isAuthenticated: true });
      },

      logout: () => {
        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'gym-auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Theme store for dark/light mode preference
interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to dark theme

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'gym-theme-storage',
    }
  )
);

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Helper to get stored access token
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};
