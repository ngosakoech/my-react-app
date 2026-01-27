# API Services Documentation

This directory contains all the API service modules for the United Winners DT Board Portal.

## Overview

All services are built on a mock data layer that simulates API calls with realistic delays. They use TypeScript for type safety and follow consistent patterns for error handling and data management.

## Services

### 1. **api.ts** - Base API Configuration
- Axios instance with baseURL from environment variables
- Request interceptor to add auth token from localStorage
- Response interceptor for global error handling
- Helper functions for mock data simulation

**Key Features:**
- Automatic token attachment to requests
- Global error handling with user-friendly messages
- 401 redirect to login page
- Mock API delay simulation

### 2. **authService.ts** - Authentication
Handles user authentication and session management.

**Methods:**
- `login(credentials)` - Authenticate user with email/password
- `logout()` - Clear session and tokens
- `getCurrentUser()` - Get authenticated user from token
- `refreshToken()` - Refresh authentication token
- `verifyEmail(email)` - Password reset email verification
- `resetPassword(token, newPassword)` - Reset user password
- `changePassword(currentPassword, newPassword)` - Change password

**Mock Login:**
- Email: Any user from mockUsers (e.g., `john.kamau@unitedwinners.co.ke`)
- Password: `password123` (for all users)

### 3. **meetingService.ts** - Meeting Management
Manages board meetings, agendas, and minutes.

**Methods:**
- `getMeetings(filters?)` - Get paginated meetings with filters
- `getMeetingById(id)` - Get single meeting details
- `createMeeting(data)` - Create new meeting
- `updateMeeting(id, data)` - Update meeting
- `deleteMeeting(id)` - Delete meeting
- `getMeetingAgenda(id)` - Get meeting agenda items
- `updateAgendaItem(meetingId, itemId, data)` - Update agenda item
- `addAgendaItem(meetingId, item)` - Add agenda item
- `removeAgendaItem(meetingId, itemId)` - Remove agenda item
- `getUpcomingMeetings(limit?)` - Get upcoming meetings
- `cancelMeeting(id, reason?)` - Cancel a meeting

### 4. **loanService.ts** - Loan Applications
Handles loan application submissions, reviews, and approvals.

**Methods:**
- `getLoans(filters?)` - Get paginated loans with filters
- `getLoanById(id)` - Get single loan application
- `createLoan(data)` - Submit new loan application
- `updateLoan(id, data)` - Update loan application
- `addRecommendation(loanId, recommendation)` - Add review recommendation
- `approveLoan(loanId, decision)` - Final approval/rejection decision
- `getPendingLoans()` - Get loans pending review
- `getLoanStatistics()` - Get loan statistics
- `disburseLoan(loanId)` - Mark loan as disbursed

### 5. **documentService.ts** - Document Management
Manages document uploads, downloads, and access tracking.

**Methods:**
- `getDocuments(filters?)` - Get paginated documents with filters
- `getDocumentById(id)` - Get single document
- `uploadDocument(data)` - Upload new document (mock)
- `updateDocument(id, data)` - Update document metadata
- `deleteDocument(id)` - Delete document
- `downloadDocument(id)` - Get download URL
- `logAccess(documentId, userId)` - Log document access
- `getDocumentsByCategory(category)` - Get documents by category
- `getRecentDocuments(limit?)` - Get recent documents
- `searchByTags(tags)` - Search documents by tags
- `getExpiringDocuments(daysBeforeExpiry?)` - Get expiring documents
- `getAccessHistory(documentId)` - Get document access history
- `getDocumentStatistics()` - Get document statistics

### 6. **votingService.ts** - Voting & Resolutions
Manages board resolutions and voting processes.

**Methods:**
- `getResolutions(filters?)` - Get paginated resolutions with filters
- `getResolutionById(id)` - Get single resolution
- `createResolution(data)` - Create new resolution
- `castVote(resolutionId, vote)` - Cast a vote
- `getVotingResults(resolutionId)` - Get voting results
- `closeResolution(resolutionId)` - Close voting and finalize results
- `activateResolution(resolutionId)` - Activate draft resolution
- `getPendingVotes(userId)` - Get resolutions user hasn't voted on
- `getVotedResolutions(userId)` - Get resolutions user has voted on
- `updateResolution(resolutionId, data)` - Update draft resolution
- `deleteResolution(resolutionId)` - Delete draft resolution
- `archiveResolution(resolutionId)` - Archive closed resolution
- `getResolutionStatistics()` - Get resolution statistics

### 7. **userService.ts** - User Management
Manages user accounts and profiles.

**Methods:**
- `getUsers(filters?)` - Get paginated users with filters
- `getUserById(id)` - Get single user
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user details
- `deactivateUser(id)` - Deactivate user account
- `reactivateUser(id)` - Reactivate user account
- `resetPassword(userId)` - Reset user password
- `getUsersByRole(role)` - Get users by role
- `getActiveUsers()` - Get all active users
- `getBoardMembers()` - Get board members with voting rights
- `getUserStatistics()` - Get user statistics
- `searchUsers(query)` - Search users
- `getDepartments()` - Get list of departments
- `getUsersByDepartment(department)` - Get users by department
- `bulkDeactivateUsers(userIds)` - Bulk deactivate users
- `bulkActivateUsers(userIds)` - Bulk activate users

## Usage Examples

### Authentication
```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'john.kamau@unitedwinners.co.ke',
  password: 'password123',
  rememberMe: true
});

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### Meetings
```typescript
import { meetingService } from '@/services';

// Get upcoming meetings
const meetings = await meetingService.getUpcomingMeetings(5);

// Create meeting
const newMeeting = await meetingService.createMeeting({
  title: 'Q1 2024 Board Meeting',
  date: new Date('2024-03-15'),
  time: '10:00 AM - 2:00 PM',
  location: 'Main Conference Room',
  type: 'board',
  agenda: [...],
  attendees: ['usr-001', 'usr-002']
});
```

### Loans
```typescript
import { loanService } from '@/services';

// Get pending loans
const pendingLoans = await loanService.getPendingLoans();

// Add recommendation
await loanService.addRecommendation('LN-2024-001', {
  reviewerId: 'usr-008',
  reviewerName: 'Elizabeth Wangari',
  recommendation: 'approve',
  comments: 'Good credit history and adequate collateral.'
});
```

### Documents
```typescript
import { documentService } from '@/services';

// Upload document
const doc = await documentService.uploadDocument({
  title: 'Q1 Financial Report',
  category: 'financial',
  type: 'application/pdf',
  file: fileObject,
  tags: ['Q1', '2024', 'financial']
});

// Get documents by category
const financialDocs = await documentService.getDocumentsByCategory('financial');
```

### Voting
```typescript
import { votingService } from '@/services';

// Get pending votes
const pendingVotes = await votingService.getPendingVotes('usr-001');

// Cast vote
await votingService.castVote('res-001', {
  userId: 'usr-001',
  decision: 'yes',
  comment: 'I support this resolution.'
});

// Get results
const results = await votingService.getVotingResults('res-001');
```

### Users
```typescript
import { userService } from '@/services';

// Get board members
const boardMembers = await userService.getBoardMembers();

// Create user
const newUser = await userService.createUser({
  email: 'new.user@unitedwinners.co.ke',
  firstName: 'New',
  lastName: 'User',
  role: 'board_member',
  department: 'Finance'
});
```

## Error Handling

All services return promises and throw standardized errors:

```typescript
try {
  await loanService.approveLoan(loanId, decision);
} catch (error) {
  // Error structure:
  // {
  //   message: string,
  //   code: string,
  //   status: number
  // }
  console.error(error.message);
}
```

## Environment Variables

Set in `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Mock Data

All services use mock data from `/src/mocks/`:
- `users.mock.ts`
- `meetings.mock.ts`
- `loans.mock.ts`
- `documents.mock.ts`
- `resolutions.mock.ts`

Data persists in memory during the session but resets on page reload.

## Future: Real API Integration

To switch to a real API:
1. Update `VITE_API_BASE_URL` in environment variables
2. Replace mock service methods with real API calls using `apiClient`
3. Remove `simulateApiDelay` wrappers
4. Update response structures to match backend

Example:
```typescript
// Current (mock)
async getLoans(filters?: LoanFilters) {
  return simulateApiDelay(() => {
    // Mock logic
  }, 600);
}

// Future (real API)
async getLoans(filters?: LoanFilters) {
  const response = await apiClient.get('/loans', { params: filters });
  return response.data;
}
```
