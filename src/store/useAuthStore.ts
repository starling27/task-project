import { create } from 'zustand';
import { apiService } from '../services/apiService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PartialUser {
  provider: string;
  providerId: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  partialUser: PartialUser | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;

  loginWithGoogle: () => void;
  setSession: (token: string, user: AuthUser) => void;
  setPartialSession: (partialUser: PartialUser) => void;
  completeRegistration: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
  setError: (error: string | null) => void;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  partialUser: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,

  loginWithGoogle: () => {
    set({ loading: true, error: null });
    window.location.href = '/api/v1/auth/google';
  },

  setSession: (token, user) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true, partialUser: null, error: null, loading: false });
  },

  setPartialSession: (partialUser) => {
    set({ partialUser, loading: false, isAuthenticated: false });
  },

  completeRegistration: async (email) => {
    const { partialUser } = get();
    if (!partialUser) return;

    set({ loading: true, error: null });
    try {
      const response = await apiService.post('/api/v1/auth/google/register', {
        email,
        ...partialUser
      });
      const { token, user } = response as { token: string; user: AuthUser };
      get().setSession(token, user);
    } catch (err: any) {
      set({ error: err.message || 'Failed to complete registration', loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await apiService.post('/api/v1/auth/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      
      // Clear API cache on logout
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('api_cache_')) {
          sessionStorage.removeItem(key);
        }
      });

      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false,
        error: null 
      });
    }
  },

  initAuth: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userJson = sessionStorage.getItem(USER_KEY);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        set({ token, user, isAuthenticated: true });
      } catch (err) {
        console.error('Failed to parse user from sessionStorage:', err);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      }
    }
  },

  setError: (error) => set({ error, loading: false })
}));
