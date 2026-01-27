import { UserRole } from '../types/auth.types';
import { MeetingStatus, MeetingType } from '../types/meeting.types';
import { DocumentCategory } from '../types/document.types';
import { VotingRule } from '../types/voting.types';
import { LoanStatus, LoanType, LoanUrgency } from '../types/loan.types';

// Application constants
export const APP_NAME = 'United Winners DT Board Portal';
export const APP_VERSION = '1.0.0';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// Routes constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  // Meetings
  MEETINGS: '/meetings',
  MEETINGS_LIST: '/meetings/list',
  MEETINGS_CREATE: '/meetings/create',
  MEETINGS_DETAIL: '/meetings/:id',
  MEETINGS_EDIT: '/meetings/:id/edit',
  
  // Documents
  DOCUMENTS: '/documents',
  DOCUMENTS_LIST: '/documents/list',
  DOCUMENTS_UPLOAD: '/documents/upload',
  DOCUMENTS_DETAIL: '/documents/:id',
  
  // Voting
  VOTING: '/voting',
  VOTING_LIST: '/voting/list',
  VOTING_CREATE: '/voting/create',
  VOTING_DETAIL: '/voting/:id',
  
  // Loans
  LOANS: '/loans',
  LOANS_LIST: '/loans/list',
  LOANS_CREATE: '/loans/create',
  LOANS_DETAIL: '/loans/:id',
  LOANS_REVIEW: '/loans/:id/review',
  
  // Users
  USERS: '/users',
  USERS_LIST: '/users/list',
  USERS_CREATE: '/users/create',
  USERS_DETAIL: '/users/:id',
  USERS_EDIT: '/users/:id/edit',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SETTINGS: '/profile/settings',
  
  // Settings
  SETTINGS: '/settings',
  
  // Other
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

// User role constants
export const USER_ROLES = UserRole;

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.BOARD_MEMBER]: 'Board Member',
  [UserRole.SUBCOMMITTEE_MEMBER]: 'Subcommittee Member',
  [UserRole.CHAIRPERSON]: 'Chairperson',
  [UserRole.SECRETARY]: 'Secretary',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.CHAIRPERSON]: [
    'meetings:create',
    'meetings:edit',
    'meetings:delete',
    'meetings:view',
    'documents:upload',
    'documents:view',
    'documents:delete',
    'voting:create',
    'voting:view',
    'voting:vote',
    'loans:view',
    'loans:approve',
    'users:view',
  ],
  [UserRole.BOARD_MEMBER]: [
    'meetings:view',
    'documents:view',
    'documents:upload',
    'voting:view',
    'voting:vote',
    'loans:view',
  ],
  [UserRole.SUBCOMMITTEE_MEMBER]: [
    'meetings:view',
    'documents:view',
    'voting:view',
    'loans:view',
    'loans:recommend',
  ],
  [UserRole.SECRETARY]: [
    'meetings:create',
    'meetings:edit',
    'meetings:view',
    'documents:upload',
    'documents:view',
    'documents:edit',
    'voting:view',
    'loans:view',
  ],
} as const;

// Meeting status/type constants
export const MEETING_STATUSES = MeetingStatus;
export const MEETING_TYPES = MeetingType;

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  [MeetingStatus.SCHEDULED]: 'Scheduled',
  [MeetingStatus.IN_PROGRESS]: 'In Progress',
  [MeetingStatus.COMPLETED]: 'Completed',
  [MeetingStatus.CANCELLED]: 'Cancelled',
};

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  [MeetingType.BOARD]: 'Board Meeting',
  [MeetingType.SUBCOMMITTEE]: 'Subcommittee Meeting',
  [MeetingType.EMERGENCY]: 'Emergency Meeting',
  [MeetingType.ANNUAL]: 'Annual Meeting',
  [MeetingType.SPECIAL]: 'Special Meeting',
};

// Document category constants
export const DOCUMENT_CATEGORIES = DocumentCategory;

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.MINUTES]: 'Meeting Minutes',
  [DocumentCategory.FINANCIAL]: 'Financial Documents',
  [DocumentCategory.POLICY]: 'Policies',
  [DocumentCategory.LOAN]: 'Loan Documents',
  [DocumentCategory.AUDIT]: 'Audit Reports',
  [DocumentCategory.REPORT]: 'Reports',
  [DocumentCategory.OTHER]: 'Other',
};

// Voting rule constants
export const VOTING_RULES = VotingRule;

export const VOTING_RULE_LABELS: Record<VotingRule, string> = {
  [VotingRule.SIMPLE_MAJORITY]: 'Simple Majority (>50%)',
  [VotingRule.TWO_THIRDS]: 'Two-Thirds Majority (≥66.67%)',
  [VotingRule.UNANIMOUS]: 'Unanimous (100%)',
  [VotingRule.QUORUM_ONLY]: 'Quorum Only',
};

export const VOTING_RULE_THRESHOLDS: Record<VotingRule, number> = {
  [VotingRule.SIMPLE_MAJORITY]: 0.5,
  [VotingRule.TWO_THIRDS]: 0.6667,
  [VotingRule.UNANIMOUS]: 1.0,
  [VotingRule.QUORUM_ONLY]: 0.0,
};

// Loan constants
export const LOAN_STATUSES = LoanStatus;
export const LOAN_TYPES = LoanType;
export const LOAN_URGENCIES = LoanUrgency;

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  [LoanStatus.SUBMITTED]: 'Submitted',
  [LoanStatus.UNDER_REVIEW]: 'Under Review',
  [LoanStatus.APPROVED]: 'Approved',
  [LoanStatus.REJECTED]: 'Rejected',
  [LoanStatus.DISBURSED]: 'Disbursed',
};

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  [LoanType.PERSONAL]: 'Personal Loan',
  [LoanType.BUSINESS]: 'Business Loan',
  [LoanType.EMERGENCY]: 'Emergency Loan',
  [LoanType.EDUCATION]: 'Education Loan',
  [LoanType.AGRICULTURE]: 'Agriculture Loan',
};

export const LOAN_URGENCY_LABELS: Record<LoanUrgency, string> = {
  [LoanUrgency.LOW]: 'Low Priority',
  [LoanUrgency.MEDIUM]: 'Medium Priority',
  [LoanUrgency.HIGH]: 'High Priority',
  [LoanUrgency.CRITICAL]: 'Critical',
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  WITH_TIME: 'MM/dd/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  AVATAR: 2 * 1024 * 1024, // 2MB
  MAX_UPLOAD: 50 * 1024 * 1024, // 50MB
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Quorum settings
export const DEFAULT_QUORUM = 0.5; // 50%
export const MIN_QUORUM = 0.33; // 33%
export const MAX_QUORUM = 1.0; // 100%

// Toast notification durations (in milliseconds)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  RECENT_SEARCHES: 'recent_searches',
  FILTERS: 'saved_filters',
} as const;

// Status colors
export const STATUS_COLORS = {
  // Meeting statuses
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
  
  // Loan statuses
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'error',
  disbursed: 'primary',
  
  // Voting statuses
  draft: 'default',
  active: 'warning',
  closed: 'success',
  archived: 'default',
  
  // Urgency levels
  low: 'success',
  medium: 'info',
  high: 'warning',
  critical: 'error',
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  grey: '#9e9e9e',
} as const;
