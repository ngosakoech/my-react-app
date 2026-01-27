export const LoanType = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  EMERGENCY: 'emergency',
  EDUCATION: 'education',
  AGRICULTURE: 'agriculture'
} as const;

export type LoanType = (typeof LoanType)[keyof typeof LoanType];

export const LoanStatus = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DISBURSED: 'disbursed'
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

export const LoanUrgency = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export type LoanUrgency = (typeof LoanUrgency)[keyof typeof LoanUrgency];

export interface Recommendation {
  id: string;
  loanId: string;
  reviewerId: string;
  reviewerName: string;
  recommendation: 'approve' | 'reject' | 'conditional';
  comments: string;
  conditions?: string[];
  date: Date;
}

export interface Decision {
  id: string;
  loanId: string;
  decidedBy: string;
  decision: 'approved' | 'rejected';
  amount?: number;
  interestRate?: number;
  term?: number;
  conditions?: string[];
  comments?: string;
  decisionDate: Date;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantId: string;
  applicantEmail: string;
  applicantPhone: string;
  loanType: LoanType;
  amount: number;
  purpose: string;
  term: number;
  status: LoanStatus;
  submittedDate: Date;
  urgency: LoanUrgency;
  documents: string[];
  creditScore?: number;
  income?: number;
  collateral?: string;
  guarantors?: string[];
  recommendations: Recommendation[];
  finalDecision?: Decision;
  reviewedBy?: string[];
  reviewedDate?: Date;
  disbursementDate?: Date;
}
