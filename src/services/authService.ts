import { simulateApiDelay } from './api';
import type { User, LoginCredentials, AuthToken, AuthResponse } from '../types/auth.types';
import { mockUsers } from '../mocks';

// Mock password for all users (for demo purposes)
const MOCK_PASSWORD = 'password123';

// Generate a mock JWT token
const generateMockToken = (user: User): AuthToken => {
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  // In a real app, this would be a proper JWT. For mock, we'll use base64
  const mockAccessToken = btoa(JSON.stringify(tokenPayload));
  const mockRefreshToken = btoa(JSON.stringify({ ...tokenPayload, type: 'refresh' }));

  return {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresIn: 86400, // 24 hours in seconds
    tokenType: 'Bearer',
  };
};

// Decode mock token
const decodeMockToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return simulateApiDelay(async () => {
      const { email, password } = credentials;

      // Find user by email
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw {
          message: 'Invalid email or password',
          code: 'AUTH_INVALID_CREDENTIALS',
          status: 401,
        };
      }

      // Check if user is active
      if (!user.isActive) {
        throw {
          message: 'Your account has been deactivated. Please contact support.',
          code: 'AUTH_ACCOUNT_DEACTIVATED',
          status: 403,
        };
      }

      // Validate password (in real app, this would be bcrypt comparison)
      if (password !== MOCK_PASSWORD) {
        throw {
          message: 'Invalid email or password',
          code: 'AUTH_INVALID_CREDENTIALS',
          status: 401,
        };
      }

      // Generate token
      const token = generateMockToken(user);

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      };

      // Store token and user in localStorage
      localStorage.setItem('authToken', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        user: updatedUser,
        token,
      };
    }, 800);
  }

  /**
   * Logout - clear tokens and user data
   */
  async logout(): Promise<void> {
    return simulateApiDelay(async () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }, 300);
  }

  /**
   * Get current user from stored token
   */
  async getCurrentUser(): Promise<User | null> {
    return simulateApiDelay(async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        return null;
      }

      // Verify token is valid
      const decodedToken = decodeMockToken(token);
      if (!decodedToken || decodedToken.exp < Date.now()) {
        // Token expired
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return null;
      }

      try {
        const user: User = JSON.parse(storedUser);
        
        // Verify user still exists and is active
        const currentUser = mockUsers.find(u => u.id === user.id);
        if (!currentUser || !currentUser.isActive) {
          await this.logout();
          return null;
        }

        return user;
      } catch (error) {
        return null;
      }
    }, 200);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthToken> {
    return simulateApiDelay(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!refreshToken || !storedUser) {
        throw {
          message: 'No refresh token available',
          code: 'AUTH_NO_REFRESH_TOKEN',
          status: 401,
        };
      }

      // Verify refresh token
      const decodedToken = decodeMockToken(refreshToken);
      if (!decodedToken) {
        throw {
          message: 'Invalid refresh token',
          code: 'AUTH_INVALID_REFRESH_TOKEN',
          status: 401,
        };
      }

      const user: User = JSON.parse(storedUser);
      
      // Generate new tokens
      const newToken = generateMockToken(user);

      // Store new tokens
      localStorage.setItem('authToken', newToken.accessToken);
      localStorage.setItem('refreshToken', newToken.refreshToken);

      return newToken;
    }, 500);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken = decodeMockToken(token);
    return decodedToken && decodedToken.exp > Date.now();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verify email for password reset (mock)
   */
  async verifyEmail(email: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(async () => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw {
          message: 'No account found with this email address',
          code: 'AUTH_EMAIL_NOT_FOUND',
          status: 404,
        };
      }

      return {
        success: true,
        message: 'Password reset link has been sent to your email',
      };
    }, 1000);
  }

  /**
   * Reset password (mock)
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(async () => {
      // In a real app, verify the reset token
      const decodedToken = decodeMockToken(token);
      
      if (!decodedToken) {
        throw {
          message: 'Invalid or expired reset token',
          code: 'AUTH_INVALID_RESET_TOKEN',
          status: 400,
        };
      }

      // Password validation
      if (newPassword.length < 8) {
        throw {
          message: 'Password must be at least 8 characters long',
          code: 'AUTH_WEAK_PASSWORD',
          status: 400,
        };
      }

      return {
        success: true,
        message: 'Password has been reset successfully',
      };
    }, 800);
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(async () => {
      const user = await this.getCurrentUser();

      if (!user) {
        throw {
          message: 'User not authenticated',
          code: 'AUTH_NOT_AUTHENTICATED',
          status: 401,
        };
      }

      // Verify current password
      if (currentPassword !== MOCK_PASSWORD) {
        throw {
          message: 'Current password is incorrect',
          code: 'AUTH_INCORRECT_PASSWORD',
          status: 400,
        };
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw {
          message: 'New password must be at least 8 characters long',
          code: 'AUTH_WEAK_PASSWORD',
          status: 400,
        };
      }

      if (newPassword === currentPassword) {
        throw {
          message: 'New password must be different from current password',
          code: 'AUTH_SAME_PASSWORD',
          status: 400,
        };
      }

      return {
        success: true,
        message: 'Password changed successfully',
      };
    }, 800);
  }
}

export default new AuthService();
