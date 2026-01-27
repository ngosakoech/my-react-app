// Auth Types
export {
  UserRole,
  type User as AuthUser,
  type LoginCredentials,
  type AuthState,
  type AuthContextType,
  type AuthResponse,
  type PasswordResetRequest,
  type PasswordReset,
  type SessionInfo
} from './auth.types';

// User Types
export {
  UserStatus,
  ActivityType,
  type User,
  type UserProfile,
  type UserPreferences,
  type UserActivity,
  type ActivityLog,
  type UserStats,
  type UserInvitation
} from './user.types';

// Meeting Types
export {
  MeetingType,
  MeetingStatus,
  AttendanceStatus,
  type Meeting,
  type RecurringPattern,
  type AgendaItem,
  type Attendee,
  type Minutes,
  type Decision as MeetingDecision,
  type ActionItem,
  type Note,
  type MeetingInvitation,
  type MeetingReminder
} from './meeting.types';

// Loan Types
export {
  LoanType,
  LoanStatus,
  type LoanApplication,
  type CollateralInfo,
  type EmploymentInfo,
  type FinancialInfo,
  type Debt,
  type Asset,
  type Recommendation,
  type RiskAssessment,
  type Decision as LoanDecision,
  type LoanTerms,
  type PaymentSchedule,
  type LoanDisbursement,
  type LoanRepayment
} from './loan.types';

// Document Types
export {
  DocumentCategory,
  DocumentStatus,
  DocumentAction,
  type Document,
  type DocumentMetadata,
  type AccessControl,
  type AccessLog,
  type DocumentVersion,
  type DocumentComment,
  type DocumentShare,
  type DocumentApproval,
  type DocumentTemplate,
  type TemplateField,
  type DocumentFolder
} from './document.types';

// Voting Types
export {
  ResolutionStatus,
  VotingRule,
  VoteChoice,
  VotingOutcome,
  VotingAuditAction,
  type Resolution,
  type EligibleVoter,
  type Vote,
  type VotingResult,
  type VotingSession,
  type VotingNotification,
  type VotingDelegate,
  type VotingAudit,
  type VotingStatistics,
  type VotingTimeSeriesData,
  type VotingConfig
} from './voting.types';
