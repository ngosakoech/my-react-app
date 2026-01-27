import { simulateApiDelay, createPaginatedResponse } from './api';
import type { PaginatedResponse } from './api';
import type { User } from '../types/auth.types';
import { UserRole } from '../types/auth.types';
import { mockUsers } from '../mocks';

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  department?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position?: string;
  department?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  position?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

class UserService {
  // Local state for mock data
  private users: User[] = [...mockUsers];

  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    return simulateApiDelay(() => {
      let filteredUsers = [...this.users];

      // Apply filters
      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      if (filters?.department) {
        filteredUsers = filteredUsers.filter(user => 
          user.department?.toLowerCase() === filters.department!.toLowerCase()
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.position?.toLowerCase().includes(searchLower)
        );
      }

      // Sort by name
      filteredUsers.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      // Paginate
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      return createPaginatedResponse(filteredUsers, page, pageSize);
    }, 600);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User> {
    return simulateApiDelay(() => {
      const user = this.users.find(u => u.id === id);

      if (!user) {
        throw {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404,
        };
      }

      return user;
    }, 400);
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    return simulateApiDelay(() => {
      // Validate email uniqueness
      const existingUser = this.users.find(
        u => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        throw {
          message: 'A user with this email already exists',
          code: 'USER_EMAIL_EXISTS',
          status: 409,
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw {
          message: 'Invalid email format',
          code: 'INVALID_EMAIL',
          status: 400,
        };
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        position: data.position,
        department: data.department,
        phone: data.phone,
        avatar: data.avatar,
        isActive: true,
        createdAt: new Date(),
      };

      this.users.push(newUser);

      return newUser;
    }, 800);
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return simulateApiDelay(() => {
      const userIndex = this.users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        throw {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404,
        };
      }

      const user = this.users[userIndex]!;

      // If email is being updated, check uniqueness
      if (data.email && data.email !== user.email) {
        const existingUser = this.users.find(
          u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id
        );

        if (existingUser) {
          throw {
            message: 'A user with this email already exists',
            code: 'USER_EMAIL_EXISTS',
            status: 409,
          };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw {
            message: 'Invalid email format',
            code: 'INVALID_EMAIL',
            status: 400,
          };
        }
      }

      // Update user - merge with existing required fields
      const updatedUser: User = {
        id: user.id,
        email: data.email ?? user.email,
        firstName: data.firstName ?? user.firstName,
        lastName: data.lastName ?? user.lastName,
        role: data.role ?? user.role,
        position: data.position ?? user.position,
        department: data.department ?? user.department,
        phone: data.phone ?? user.phone,
        avatar: data.avatar ?? user.avatar,
        isActive: data.isActive ?? user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      };

      this.users[userIndex] = updatedUser;

      return updatedUser;
    }, 700);
  }

  /**
   * Deactivate a user (soft delete)
   */
  async deactivateUser(id: string): Promise<User> {
    return simulateApiDelay(() => {
      const userIndex = this.users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        throw {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404,
        };
      }

      const user = this.users[userIndex]!;

      // Check if user is already inactive
      if (!user.isActive) {
        throw {
          message: 'User is already deactivated',
          code: 'USER_ALREADY_INACTIVE',
          status: 400,
        };
      }

      // Prevent deactivating yourself
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id === currentUser.id) {
        throw {
          message: 'You cannot deactivate your own account',
          code: 'CANNOT_DEACTIVATE_SELF',
          status: 400,
        };
      }

      user.isActive = false;

      return user;
    }, 600);
  }

  /**
   * Reactivate a user
   */
  async reactivateUser(id: string): Promise<User> {
    return simulateApiDelay(() => {
      const userIndex = this.users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        throw {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404,
        };
      }

      const user = this.users[userIndex]!;

      // Check if user is already active
      if (user.isActive) {
        throw {
          message: 'User is already active',
          code: 'USER_ALREADY_ACTIVE',
          status: 400,
        };
      }

      user.isActive = true;

      return user;
    }, 600);
  }

  /**
   * Reset user password (mock)
   */
  async resetPassword(userId: string): Promise<{ success: boolean; message: string; tempPassword?: string }> {
    return simulateApiDelay(() => {
      const user = this.users.find(u => u.id === userId);

      if (!user) {
        throw {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404,
        };
      }

      if (!user.isActive) {
        throw {
          message: 'Cannot reset password for inactive user',
          code: 'USER_INACTIVE',
          status: 400,
        };
      }

      // Generate temporary password (in real app, this would be sent via email)
      const tempPassword = `Temp${Math.random().toString(36).substring(2, 10)}!`;

      return {
        success: true,
        message: 'Password reset successfully. Temporary password has been sent to user\'s email.',
        tempPassword, // Only for demo purposes
      };
    }, 800);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return simulateApiDelay(() => {
      return this.users
        .filter(user => user.role === role)
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }, 400);
  }

  /**
   * Get active users
   */
  async getActiveUsers(): Promise<User[]> {
    return simulateApiDelay(() => {
      return this.users
        .filter(user => user.isActive)
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }, 400);
  }

  /**
   * Get board members (users with voting rights)
   */
  async getBoardMembers(): Promise<User[]> {
    return simulateApiDelay(() => {
      return this.users
        .filter(user =>
          (user.role === UserRole.BOARD_MEMBER ||
            user.role === UserRole.CHAIRPERSON ||
            user.role === UserRole.ADMIN) &&
          user.isActive
        )
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }, 400);
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
    recentLogins: number;
  }> {
    return simulateApiDelay(() => {
      const total = this.users.length;
      const active = this.users.filter(u => u.isActive).length;
      const inactive = this.users.filter(u => !u.isActive).length;

      const byRole: Record<string, number> = {};
      Object.values(UserRole).forEach(role => {
        byRole[role] = this.users.filter(u => u.role === role).length;
      });

      // Users who logged in within last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLogins = this.users.filter(
        u => u.lastLogin && u.lastLogin >= sevenDaysAgo
      ).length;

      return {
        total,
        active,
        inactive,
        byRole: byRole as Record<UserRole, number>,
        recentLogins,
      };
    }, 400);
  }

  /**
   * Search users (advanced search)
   */
  async searchUsers(query: string): Promise<User[]> {
    return simulateApiDelay(() => {
      const searchLower = query.toLowerCase();
      
      return this.users
        .filter(user =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.position?.toLowerCase().includes(searchLower) ||
          user.department?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower)
        )
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }, 500);
  }

  /**
   * Get departments list
   */
  async getDepartments(): Promise<string[]> {
    return simulateApiDelay(() => {
      const departments = new Set<string>();
      this.users.forEach(user => {
        if (user.department) {
          departments.add(user.department);
        }
      });
      return Array.from(departments).sort();
    }, 300);
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: string): Promise<User[]> {
    return simulateApiDelay(() => {
      return this.users
        .filter(user => 
          user.department?.toLowerCase() === department.toLowerCase() &&
          user.isActive
        )
        .sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }, 400);
  }

  /**
   * Bulk deactivate users
   */
  async bulkDeactivateUsers(userIds: string[]): Promise<{ success: boolean; deactivatedCount: number }> {
    return simulateApiDelay(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      let deactivatedCount = 0;

      userIds.forEach(userId => {
        const user = this.users.find(u => u.id === userId);
        if (user && user.isActive && user.id !== currentUser.id) {
          user.isActive = false;
          deactivatedCount++;
        }
      });

      return {
        success: true,
        deactivatedCount,
      };
    }, 1000);
  }

  /**
   * Bulk activate users
   */
  async bulkActivateUsers(userIds: string[]): Promise<{ success: boolean; activatedCount: number }> {
    return simulateApiDelay(() => {
      let activatedCount = 0;

      userIds.forEach(userId => {
        const user = this.users.find(u => u.id === userId);
        if (user && !user.isActive) {
          user.isActive = true;
          activatedCount++;
        }
      });

      return {
        success: true,
        activatedCount,
      };
    }, 1000);
  }
}

export default new UserService();
