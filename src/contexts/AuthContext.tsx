import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import type { User, LoginCredentials, AuthResponse } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decodedToken = JSON.parse(atob(token));
      // JWT exp is in seconds, Date.now() is in milliseconds
      return decodedToken.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (state.token && isTokenExpired(state.token)) {
      logout();
    }
  }, [state.token, isTokenExpired, logout]);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const token = authService.getToken();
      
      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        await authService.logout();
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const user = await authService.getCurrentUser();
      
      if (user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Failed to authenticate',
      });
    }
  }, [isTokenExpired]);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response: AuthResponse = await authService.login(credentials);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token.accessToken,
        },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Login failed',
      });
      throw error;
    }
  }, []);

  // Update user
  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
