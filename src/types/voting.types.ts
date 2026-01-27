import { UserRole } from './auth.types';

export enum ResolutionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export enum VotingRule {
  SIMPLE_MAJORITY = 'SIMPLE_MAJORITY',
  TWO_THIRDS = 'TWO_THIRDS',
  UNANIMOUS = 'UNANIMOUS'
}

export enum VoteChoice {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
  ABSTAIN = 'ABSTAIN'
}

export interface Resolution {
  id: string;
  resolutionNumber: string;
  title: string;
  description: string;
  status: ResolutionStatus;
  votingRule: VotingRule;
  category?: string;
  proposedBy: string;
  proposedByName: string;
  proposedAt: Date;
  votingStartDate: Date;
  votingEndDate: Date;
  eligibleVoters: EligibleVoter[];
  votes: Vote[];
  result?: VotingResult;
  meetingId?: string;
  agendaItemId?: string;
  attachments?: string[];
  isAnonymous: boolean;
  allowAbstention: boolean;
  requiredQuorum?: number;
  actualQuorum?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EligibleVoter {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  votingWeight: number;
  hasVoted: boolean;
  notified: boolean;
  notifiedAt?: Date;
}

export interface Vote {
  id: string;
  resolutionId: string;
  voterId: string;
  voterName: string;
  voterRole: UserRole;
  choice: VoteChoice;
  votingWeight: number;
  comments?: string;
  votedAt: Date;
  isAnonymous: boolean;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface VotingResult {
  resolutionId: string;
  totalEligibleVoters: number;
  totalVotesCast: number;
  votingParticipation: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  weightedVotesFor: number;
  weightedVotesAgainst: number;
  weightedVotesAbstain: number;
  outcome: VotingOutcome;
  passed: boolean;
  requiredThreshold: number;
  actualThreshold: number;
  quorumMet: boolean;
  calculatedAt: Date;
  finalizedAt?: Date;
  finalizedBy?: string;
  notes?: string;
}

export enum VotingOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  TIE = 'TIE',
  QUORUM_NOT_MET = 'QUORUM_NOT_MET',
  PENDING = 'PENDING'
}

export interface VotingSession {
  id: string;
  name: string;
  description?: string;
  meetingId?: string;
  resolutions: string[];
  startDate: Date;
  endDate: Date;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VotingNotification {
  id: string;
  resolutionId: string;
  recipientId: string;
  recipientEmail: string;
  notificationType: 'VOTING_OPEN' | 'VOTING_REMINDER' | 'VOTING_CLOSED' | 'RESULT_ANNOUNCEMENT';
  sentAt: Date;
  deliveryStatus: 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  openedAt?: Date;
  clickedAt?: Date;
}

export interface VotingDelegate {
  id: string;
  resolutionId?: string;
  delegatorId: string;
  delegatorName: string;
  delegateId: string;
  delegateName: string;
  delegatedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  scope: 'SPECIFIC_RESOLUTION' | 'ALL_RESOLUTIONS' | 'MEETING';
  notes?: string;
}

export interface VotingAudit {
  id: string;
  resolutionId: string;
  action: VotingAuditAction;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  details: string;
  metadata?: Record<string, any>;
}

export enum VotingAuditAction {
  RESOLUTION_CREATED = 'RESOLUTION_CREATED',
  RESOLUTION_UPDATED = 'RESOLUTION_UPDATED',
  RESOLUTION_PUBLISHED = 'RESOLUTION_PUBLISHED',
  VOTING_STARTED = 'VOTING_STARTED',
  VOTING_EXTENDED = 'VOTING_EXTENDED',
  VOTING_CLOSED = 'VOTING_CLOSED',
  VOTE_CAST = 'VOTE_CAST',
  VOTE_CHANGED = 'VOTE_CHANGED',
  RESULT_CALCULATED = 'RESULT_CALCULATED',
  RESULT_FINALIZED = 'RESULT_FINALIZED',
  DELEGATE_ASSIGNED = 'DELEGATE_ASSIGNED',
  DELEGATE_REVOKED = 'DELEGATE_REVOKED'
}

export interface VotingStatistics {
  resolutionId: string;
  totalResolutions: number;
  activeResolutions: number;
  completedResolutions: number;
  averageParticipation: number;
  passRate: number;
  timeSeriesData?: VotingTimeSeriesData[];
}

export interface VotingTimeSeriesData {
  timestamp: Date;
  votesCast: number;
  cumulativeVotes: number;
}

export interface VotingConfig {
  defaultVotingDuration: number;
  defaultVotingRule: VotingRule;
  defaultQuorum: number;
  allowAnonymousVoting: boolean;
  allowVoteChanges: boolean;
  allowDelegation: boolean;
  reminderSchedule: number[];
  autoCloseVoting: boolean;
}
