// Export base API configuration
export { default as apiClient, simulateApiDelay, createPaginatedResponse } from './api';
export type { ApiError, ApiResponse, PaginatedResponse } from './api';

// Export authentication service
export { default as authService } from './authService';

// Export meeting service
export { default as meetingService } from './meetingService';
export type { MeetingFilters, CreateMeetingData, UpdateMeetingData } from './meetingService';

// Export loan service
export { default as loanService } from './loanService';
export type {
  LoanFilters,
  CreateLoanData,
  UpdateLoanData,
  AddRecommendationData,
  ApproveLoanData,
} from './loanService';

// Export document service
export { default as documentService } from './documentService';
export type {
  DocumentFilters,
  UploadDocumentData,
  UpdateDocumentData,
} from './documentService';

// Export voting service
export { default as votingService } from './votingService';
export type {
  ResolutionFilters,
  CreateResolutionData,
  CastVoteData,
} from './votingService';

// Export user service
export { default as userService } from './userService';
export type {
  UserFilters,
  CreateUserData,
  UpdateUserData,
} from './userService';
