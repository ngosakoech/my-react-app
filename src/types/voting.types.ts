export const ResolutionStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  ARCHIVED: 'archived'
} as const;

export type ResolutionStatus = (typeof ResolutionStatus)[keyof typeof ResolutionStatus];

export const VotingRule = {
  SIMPLE_MAJORITY: 'simple_majority',
  TWO_THIRDS: 'two_thirds',
  UNANIMOUS: 'unanimous',
  QUORUM_ONLY: 'quorum_only'
} as const;

export type VotingRule = (typeof VotingRule)[keyof typeof VotingRule];

export const VoteDecision = {
  YES: 'yes',
  NO: 'no',
  ABSTAIN: 'abstain'
} as const;

export type VoteDecision = (typeof VoteDecision)[keyof typeof VoteDecision];

export interface Vote {
  userId: string;
  userName?: string;
  decision: VoteDecision;
  comment?: string;
  timestamp: Date;
}

export interface VotingResult {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  percentageYes: number;
  percentageNo: number;
  percentageAbstain: number;
  isPassed: boolean;
  requiredVotes: number;
  quorumMet: boolean;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdDate: Date;
  votingDeadline: Date;
  status: ResolutionStatus;
  votingRule: VotingRule;
  isAnonymous: boolean;
  votes: Vote[];
  result?: VotingResult;
  attachments: string[];
  category?: string;
  relatedMeetingId?: string;
  modifiedBy?: string;
  modifiedDate?: Date;
  closedBy?: string;
  closedDate?: Date;
}
