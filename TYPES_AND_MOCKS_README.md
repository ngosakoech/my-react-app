# United Winners DT Board Portal - Type Definitions & Mock Data

This directory contains comprehensive TypeScript type definitions and mock data for the United Winners DT Board Portal application.

## Type Definitions (`/src/types/`)

### 1. **auth.types.ts** - Authentication Types
Defines user authentication and authorization structures.

**Key Types:**
- `UserRole` - User role constants (admin, board_member, subcommittee_member, chairperson, secretary)
- `User` - User profile information
- `AuthState` - Authentication state management
- `LoginCredentials` - Login request payload
- `AuthToken` - JWT token structure
- `AuthResponse` - Authentication response

### 2. **meeting.types.ts** - Meeting Management Types
Comprehensive meeting and agenda management types.

**Key Types:**
- `MeetingType` - Types of meetings (board, subcommittee, emergency, annual, special)
- `MeetingStatus` - Meeting lifecycle status (scheduled, in_progress, completed, cancelled)
- `Meeting` - Complete meeting information with agenda and documents
- `AgendaItem` - Individual agenda item details
- `Minutes` - Meeting minutes documentation
- `Note` - Meeting notes and annotations

### 3. **loan.types.ts** - Loan Application Types
Loan application and review workflow types.

**Key Types:**
- `LoanType` - Loan categories (personal, business, emergency, education, agriculture)
- `LoanStatus` - Application workflow status (submitted, under_review, approved, rejected, disbursed)
- `LoanUrgency` - Priority levels (low, medium, high, critical)
- `LoanApplication` - Complete loan application data
- `Recommendation` - Reviewer recommendations
- `Decision` - Final decision details

### 4. **document.types.ts** - Document Management Types
Document storage, categorization, and access control types.

**Key Types:**
- `DocumentCategory` - Document classification (minutes, financial, policy, loan, audit, report, other)
- `Document` - Document metadata and access information
- `AccessLog` - Document access audit trail

### 5. **voting.types.ts** - Voting & Resolution Types
Board resolution and voting system types.

**Key Types:**
- `ResolutionStatus` - Resolution lifecycle (draft, active, closed, archived)
- `VotingRule` - Voting requirements (simple_majority, two_thirds, unanimous, quorum_only)
- `VoteDecision` - Vote options (yes, no, abstain)
- `Resolution` - Complete resolution information
- `Vote` - Individual vote record
- `VotingResult` - Vote tally and outcome

### 6. **user.types.ts** - User Profile Types
Extended user profile and settings types.

**Key Types:**
- `UserProfile` - Complete user profile information
- `Address` - User address details
- `EmergencyContact` - Emergency contact information
- `UserSettings` - User preferences and configuration
- `UserActivity` - User activity log

## Mock Data (`/src/mocks/`)

All mock data is realistic, interconnected, and ready for development and testing.

### 1. **users.mock.ts** - User Data
**Contains:** 16 sample users across all roles
- 1 Admin (CEO)
- 1 Chairperson
- 1 Secretary
- 7 Board Members
- 6 Subcommittee Members

**Helper Functions:**
- `getUserById(id)` - Find user by ID
- `getUsersByRole(role)` - Filter users by role
- `getActiveUsers()` - Get all active users

### 2. **meetings.mock.ts** - Meeting Data
**Contains:** 10 comprehensive meetings
- 2 Board meetings (Q4 2023, Q1 2024)
- 5 Subcommittee meetings (Credit, Audit, HR, Investment, Risk)
- 1 Emergency meeting
- 1 Annual General Meeting
- 1 Special meeting

Each meeting includes 5-7 detailed agenda items with presenters, durations, and documents.

**Helper Functions:**
- `getMeetingById(id)` - Find meeting by ID
- `getMeetingsByType(type)` - Filter by meeting type
- `getMeetingsByStatus(status)` - Filter by status
- `getUpcomingMeetings()` - Get scheduled meetings

### 3. **loans.mock.ts** - Loan Application Data
**Contains:** 12 loan applications
- 3 Business loans
- 3 Personal loans
- 2 Emergency loans
- 2 Education loans
- 2 Agriculture loans

Status distribution:
- 3 Disbursed
- 3 Approved
- 4 Under Review
- 1 Rejected
- 1 Submitted

**Helper Functions:**
- `getLoanById(id)` - Find loan by ID
- `getLoansByStatus(status)` - Filter by status
- `getLoansByType(type)` - Filter by loan type
- `getLoansByUrgency(urgency)` - Filter by urgency
- `getPendingLoans()` - Get pending applications

### 4. **documents.mock.ts** - Document Data
**Contains:** 22 documents across all categories
- 2 Minutes
- 5 Financial documents
- 3 Policy documents
- 12 Loan documents
- 3 Audit documents
- 4 Reports

All documents include:
- Complete metadata
- Access logs with user activity
- Relationships to meetings, loans, or resolutions
- Confidentiality flags

**Helper Functions:**
- `getDocumentById(id)` - Find document by ID
- `getDocumentsByCategory(category)` - Filter by category
- `getConfidentialDocuments()` - Get confidential documents only
- `getDocumentsByUser(userId)` - Get user's documents
- `getRecentDocuments(limit)` - Get recently uploaded documents

### 5. **resolutions.mock.ts** - Resolution & Voting Data
**Contains:** 8 resolutions with voting records
- 3 Active resolutions (voting ongoing)
- 5 Closed resolutions (voting completed)

Topics include:
- Budget approvals
- Strategic partnerships
- Policy amendments
- Board compensation
- IT infrastructure
- External auditor appointment
- Dividend distribution
- Governance framework

Each resolution includes:
- Complete voting history
- Individual board member votes and comments
- Calculated voting results
- Voting rule compliance

**Helper Functions:**
- `getResolutionById(id)` - Find resolution by ID
- `getResolutionsByStatus(status)` - Filter by status
- `getActiveResolutions()` - Get active resolutions
- `getPendingResolutions(userId)` - Get resolutions user hasn't voted on
- `getUserVote(resolutionId, userId)` - Get user's vote on resolution

## Data Relationships

The mock data is fully interconnected:

1. **Meetings ↔ Documents**: Meeting documents reference actual document IDs
2. **Meetings ↔ Users**: Attendees reference real user IDs
3. **Loans ↔ Documents**: Loan applications link to supporting documents
4. **Loans ↔ Users**: Reviewers and decision-makers are real users
5. **Resolutions ↔ Meetings**: Resolutions link to related meetings
6. **Resolutions ↔ Users**: Votes reference actual board members
7. **Documents ↔ All**: Documents relate to meetings, loans, or resolutions

## Usage Examples

### Import Types
```typescript
import { User, UserRole, Meeting, MeetingType, LoanApplication } from '@/types';
```

### Import Mock Data
```typescript
import { mockUsers, mockMeetings, mockLoans } from '@/mocks';
```

### Using Helper Functions
```typescript
// Get all board members
const boardMembers = getUsersByRole(UserRole.BOARD_MEMBER);

// Get upcoming meetings
const upcoming = getUpcomingMeetings();

// Get pending loan applications
const pendingLoans = getPendingLoans();

// Get user's pending votes
const pendingVotes = getPendingResolutions('usr-001');
```

## Data Statistics

- **Users:** 16 users across 5 roles
- **Meetings:** 10 meetings with 60+ agenda items
- **Loans:** 12 applications totaling KES 21,050,000
- **Documents:** 22 documents with full metadata
- **Resolutions:** 8 resolutions with 70+ votes
- **Total Mock Records:** 110+ interconnected data entries

## Best Practices

1. **Type Safety:** Always use TypeScript types for compile-time safety
2. **Helper Functions:** Use provided helper functions for data access
3. **Immutability:** Treat mock data as read-only in components
4. **Realistic Data:** All data represents realistic scenarios
5. **Interconnected:** Leverage relationships between data entities

## Development Notes

- All dates use JavaScript `Date` objects
- IDs follow consistent patterns (e.g., `usr-001`, `mtg-001`, `LN-2024-001`)
- Kenyan context with KES currency and local names
- Phone numbers follow Kenyan format (+254)
- All monetary values in Kenyan Shillings (KES)

## Future Enhancements

Consider adding:
- More historical data for trends
- Additional committee types
- More document types
- Performance metrics
- Notification preferences
- Communication logs
