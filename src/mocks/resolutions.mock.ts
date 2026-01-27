import type { Resolution, Vote, VotingResult } from '../types/voting.types';
import { ResolutionStatus, VotingRule, VoteDecision } from '../types/voting.types';
import { mockUsers } from './users.mock';
import { UserRole } from '../types/auth.types';

const TOTAL_BOARD_MEMBERS = mockUsers.filter(user => 
  user.role === UserRole.BOARD_MEMBER || 
  user.role === UserRole.CHAIRPERSON || 
  user.role === UserRole.ADMIN
).length;

const calculateVotingResult = (votes: Vote[], votingRule: VotingRule, totalEligibleVoters: number = TOTAL_BOARD_MEMBERS): VotingResult => {
  const totalVotes = votes.length;
  const yesVotes = votes.filter(v => v.decision === VoteDecision.YES).length;
  const noVotes = votes.filter(v => v.decision === VoteDecision.NO).length;
  const abstainVotes = votes.filter(v => v.decision === VoteDecision.ABSTAIN).length;
  
  const percentageYes = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const percentageNo = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
  const percentageAbstain = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;
  
  const quorumMet = totalVotes >= Math.ceil(totalEligibleVoters * 0.5);
  
  let isPassed = false;
  let requiredVotes = 0;
  
  switch (votingRule) {
    case VotingRule.SIMPLE_MAJORITY:
      requiredVotes = Math.ceil(totalVotes / 2);
      isPassed = yesVotes > noVotes && quorumMet;
      break;
    case VotingRule.TWO_THIRDS:
      requiredVotes = Math.ceil(totalVotes * (2/3));
      isPassed = yesVotes >= requiredVotes && quorumMet;
      break;
    case VotingRule.UNANIMOUS:
      requiredVotes = totalVotes;
      isPassed = yesVotes === totalVotes && totalVotes > 0 && quorumMet;
      break;
    case VotingRule.QUORUM_ONLY:
      requiredVotes = Math.ceil(totalEligibleVoters * 0.5);
      isPassed = quorumMet;
      break;
  }
  
  return {
    totalVotes,
    yesVotes,
    noVotes,
    abstainVotes,
    percentageYes,
    percentageNo,
    percentageAbstain,
    isPassed,
    requiredVotes,
    quorumMet
  };
};

export const mockResolutions: Resolution[] = [
  {
    id: 'res-001',
    title: 'Approval of 2024 Annual Budget',
    description: 'Resolution to approve the annual budget for fiscal year 2024, including capital expenditure of KES 45,000,000 and operational budget of KES 120,000,000.',
    createdBy: 'usr-004',
    createdDate: new Date('2024-01-20T14:00:00'),
    votingDeadline: new Date('2024-01-26T23:59:59'),
    status: ResolutionStatus.CLOSED,
    votingRule: VotingRule.SIMPLE_MAJORITY,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        comment: 'Budget is well structured and aligns with strategic objectives',
        timestamp: new Date('2024-01-25T09:30:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        comment: 'Approve with confidence',
        timestamp: new Date('2024-01-25T10:15:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-25T11:00:00')
      },
      {
        userId: 'usr-005',
        userName: 'David Kipchoge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-25T13:45:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        decision: VoteDecision.YES,
        comment: 'Risk provisions are adequate',
        timestamp: new Date('2024-01-25T14:20:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-25T15:00:00')
      },
      {
        userId: 'usr-011',
        userName: 'Daniel Mutua',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-25T16:30:00')
      },
      {
        userId: 'usr-014',
        userName: 'Anne Wambui',
        decision: VoteDecision.ABSTAIN,
        comment: 'Would like more detail on IT budget allocation',
        timestamp: new Date('2024-01-26T09:00:00')
      },
      {
        userId: 'usr-016',
        userName: 'Lucy Auma',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-26T10:30:00')
      }
    ],
    attachments: ['doc-018'],
    category: 'Finance',
    relatedMeetingId: 'mtg-006',
    closedBy: 'usr-002',
    closedDate: new Date('2024-01-26T23:59:59')
  },
  {
    id: 'res-002',
    title: 'Strategic Partnership with Regional Bank',
    description: 'Resolution to enter into a strategic partnership agreement with Regional Bank for co-lending and technology sharing.',
    createdBy: 'usr-001',
    createdDate: new Date('2024-01-12T10:00:00'),
    votingDeadline: new Date('2024-01-19T23:59:59'),
    status: ResolutionStatus.CLOSED,
    votingRule: VotingRule.TWO_THIRDS,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        comment: 'Strategic opportunity for growth',
        timestamp: new Date('2024-01-12T11:00:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        comment: 'Terms are favorable',
        timestamp: new Date('2024-01-12T11:30:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-13T09:00:00')
      },
      {
        userId: 'usr-005',
        userName: 'David Kipchoge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-13T10:30:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        decision: VoteDecision.NO,
        comment: 'Concerns about risk sharing provisions',
        timestamp: new Date('2024-01-14T14:00:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-15T09:00:00')
      },
      {
        userId: 'usr-011',
        userName: 'Daniel Mutua',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-16T11:00:00')
      },
      {
        userId: 'usr-014',
        userName: 'Anne Wambui',
        decision: VoteDecision.YES,
        comment: 'Technology integration benefits are significant',
        timestamp: new Date('2024-01-17T10:00:00')
      },
      {
        userId: 'usr-016',
        userName: 'Lucy Auma',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-18T15:00:00')
      }
    ],
    attachments: ['doc-011', 'doc-012'],
    category: 'Strategic',
    relatedMeetingId: 'mtg-003',
    closedBy: 'usr-002',
    closedDate: new Date('2024-01-19T23:59:59')
  },
  {
    id: 'res-003',
    title: 'Amendment to Credit Policy',
    description: 'Resolution to amend the credit policy to increase maximum loan limit from KES 10,000,000 to KES 15,000,000 for business loans.',
    createdBy: 'usr-008',
    createdDate: new Date('2024-01-08T15:00:00'),
    votingDeadline: new Date('2024-01-22T23:59:59'),
    status: ResolutionStatus.ACTIVE,
    votingRule: VotingRule.SIMPLE_MAJORITY,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        comment: 'Market demand justifies the increase',
        timestamp: new Date('2024-01-16T10:00:00')
      },
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-16T11:00:00')
      },
      {
        userId: 'usr-009',
        userName: 'Michael Otieno',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-17T09:30:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        decision: VoteDecision.NO,
        comment: 'Need stronger risk assessment framework first',
        timestamp: new Date('2024-01-17T14:00:00')
      }
    ],
    attachments: [],
    category: 'Policy'
  },
  {
    id: 'res-004',
    title: 'Board Member Compensation Review',
    description: 'Resolution to approve revised board member compensation structure effective Q2 2024.',
    createdBy: 'usr-010',
    createdDate: new Date('2024-01-22T11:00:00'),
    votingDeadline: new Date('2024-01-30T23:59:59'),
    status: ResolutionStatus.ACTIVE,
    votingRule: VotingRule.SIMPLE_MAJORITY,
    isAnonymous: true,
    votes: [
      {
        userId: 'usr-002',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-23T09:00:00')
      },
      {
        userId: 'usr-004',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-23T10:30:00')
      },
      {
        userId: 'usr-005',
        decision: VoteDecision.ABSTAIN,
        timestamp: new Date('2024-01-23T14:00:00')
      }
    ],
    attachments: ['doc-019'],
    category: 'Human Resources'
  },
  {
    id: 'res-005',
    title: 'IT Infrastructure Modernization Project',
    description: 'Resolution to approve KES 25,000,000 investment in IT infrastructure modernization including cloud migration and cybersecurity upgrades.',
    createdBy: 'usr-014',
    createdDate: new Date('2023-12-15T10:00:00'),
    votingDeadline: new Date('2023-12-22T23:59:59'),
    status: ResolutionStatus.CLOSED,
    votingRule: VotingRule.TWO_THIRDS,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        comment: 'Critical for operational efficiency',
        timestamp: new Date('2023-12-16T09:00:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-16T10:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-17T09:00:00')
      },
      {
        userId: 'usr-005',
        userName: 'David Kipchoge',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-17T11:00:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        decision: VoteDecision.YES,
        comment: 'Enhances security posture',
        timestamp: new Date('2023-12-18T10:00:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-19T09:00:00')
      },
      {
        userId: 'usr-011',
        userName: 'Daniel Mutua',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-19T14:00:00')
      },
      {
        userId: 'usr-014',
        userName: 'Anne Wambui',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-20T09:00:00')
      },
      {
        userId: 'usr-016',
        userName: 'Lucy Auma',
        decision: VoteDecision.YES,
        timestamp: new Date('2023-12-21T10:00:00')
      }
    ],
    attachments: [],
    category: 'Technology',
    relatedMeetingId: 'mtg-001',
    closedBy: 'usr-002',
    closedDate: new Date('2023-12-22T23:59:59')
  },
  {
    id: 'res-006',
    title: 'Appointment of External Auditor',
    description: 'Resolution to appoint PKF Kenya as external auditor for fiscal year 2024.',
    createdBy: 'usr-007',
    createdDate: new Date('2024-01-15T14:00:00'),
    votingDeadline: new Date('2024-01-25T23:59:59'),
    status: ResolutionStatus.CLOSED,
    votingRule: VotingRule.SIMPLE_MAJORITY,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-16T09:00:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-16T10:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-17T09:00:00')
      },
      {
        userId: 'usr-005',
        userName: 'David Kipchoge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-17T11:00:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-18T10:00:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        decision: VoteDecision.YES,
        comment: 'Excellent reputation and experience',
        timestamp: new Date('2024-01-18T14:00:00')
      },
      {
        userId: 'usr-011',
        userName: 'Daniel Mutua',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-19T09:00:00')
      },
      {
        userId: 'usr-014',
        userName: 'Anne Wambui',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-20T10:00:00')
      },
      {
        userId: 'usr-016',
        userName: 'Lucy Auma',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-21T11:00:00')
      }
    ],
    attachments: [],
    category: 'Audit',
    closedBy: 'usr-007',
    closedDate: new Date('2024-01-25T23:59:59')
  },
  {
    id: 'res-007',
    title: 'Dividend Distribution 2023',
    description: 'Resolution to approve dividend distribution of 8% on member shares for fiscal year 2023.',
    createdBy: 'usr-004',
    createdDate: new Date('2024-02-01T10:00:00'),
    votingDeadline: new Date('2024-02-15T23:59:59'),
    status: ResolutionStatus.ACTIVE,
    votingRule: VotingRule.SIMPLE_MAJORITY,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        comment: 'Fair return based on performance',
        timestamp: new Date('2024-02-02T09:00:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-02-02T11:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-02-03T09:00:00')
      }
    ],
    attachments: ['doc-003', 'doc-015'],
    category: 'Finance'
  },
  {
    id: 'res-008',
    title: 'Governance Framework Update',
    description: 'Resolution to adopt updated governance framework including new committee structures and reporting requirements.',
    createdBy: 'usr-016',
    createdDate: new Date('2024-01-25T15:00:00'),
    votingDeadline: new Date('2024-02-10T23:59:59'),
    status: ResolutionStatus.ACTIVE,
    votingRule: VotingRule.TWO_THIRDS,
    isAnonymous: false,
    votes: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        decision: VoteDecision.YES,
        comment: 'Strengthens organizational governance',
        timestamp: new Date('2024-01-26T10:00:00')
      },
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-27T09:00:00')
      },
      {
        userId: 'usr-016',
        userName: 'Lucy Auma',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-27T11:00:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        decision: VoteDecision.YES,
        timestamp: new Date('2024-01-28T10:00:00')
      }
    ],
    attachments: [],
    category: 'Governance'
  }
];

// Calculate results for all resolutions
mockResolutions.forEach(resolution => {
  if (resolution.status === ResolutionStatus.CLOSED || resolution.votes.length > 0) {
    resolution.result = calculateVotingResult(resolution.votes, resolution.votingRule);
  }
});

export const getResolutionById = (id: string): Resolution | undefined => {
  return mockResolutions.find(res => res.id === id);
};

export const getResolutionsByStatus = (status: ResolutionStatus): Resolution[] => {
  return mockResolutions.filter(res => res.status === status);
};

export const getActiveResolutions = (): Resolution[] => {
  return mockResolutions.filter(res => res.status === ResolutionStatus.ACTIVE);
};

export const getPendingResolutions = (userId: string): Resolution[] => {
  return mockResolutions.filter(res => 
    res.status === ResolutionStatus.ACTIVE && 
    !res.votes.some(vote => vote.userId === userId)
  );
};

export const getUserVote = (resolutionId: string, userId: string): Vote | undefined => {
  const resolution = getResolutionById(resolutionId);
  return resolution?.votes.find(vote => vote.userId === userId);
};
