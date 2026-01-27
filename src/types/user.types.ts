import { UserRole } from './auth.types';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subcommittee?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  membershipNumber?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  bio?: string;
  status: UserStatus;
  permissions: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notificationSettings: {
    meetings: boolean;
    documents: boolean;
    votes: boolean;
    announcements: boolean;
  };
}

export interface UserActivity {
  userId: string;
  userName: string;
  userRole: UserRole;
  activityType: ActivityType;
  activityDescription: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  DOCUMENT_VIEW = 'DOCUMENT_VIEW',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  DOCUMENT_DOWNLOAD = 'DOCUMENT_DOWNLOAD',
  VOTE_CAST = 'VOTE_CAST',
  MEETING_JOINED = 'MEETING_JOINED',
  MEETING_CREATED = 'MEETING_CREATED',
  LOAN_APPLICATION = 'LOAN_APPLICATION',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  COMMENT_ADDED = 'COMMENT_ADDED',
  OTHER = 'OTHER'
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityType;
  description: string;
  entityType?: string;
  entityId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface UserStats {
  userId: string;
  totalLogins: number;
  lastLogin?: Date;
  meetingsAttended: number;
  documentsViewed: number;
  votesParticipated: number;
  activeDays: number;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  token: string;
}
