import { UserRole } from './auth.types';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  bio?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  dateOfBirth?: Date;
  joinDate: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface UserSettings {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  twoFactorEnabled: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}
