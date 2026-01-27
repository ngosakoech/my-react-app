import type { LoanApplication } from '../types/loan.types';
import { LoanType, LoanStatus, LoanUrgency } from '../types/loan.types';

export const mockLoans: LoanApplication[] = [
  {
    id: 'LN-2024-001',
    applicantName: 'Francis Kariuki',
    applicantId: 'MEM-2024-0156',
    applicantEmail: 'francis.kariuki@email.com',
    applicantPhone: '+254 720 111222',
    loanType: LoanType.BUSINESS,
    amount: 5000000,
    purpose: 'Expansion of retail business - opening two new branches in Nairobi suburbs',
    term: 36,
    status: LoanStatus.APPROVED,
    submittedDate: new Date('2023-12-20T10:30:00'),
    urgency: LoanUrgency.MEDIUM,
    documents: ['doc-007', 'doc-008'],
    creditScore: 720,
    income: 450000,
    collateral: 'Commercial property valued at KES 8,000,000',
    guarantors: ['MEM-2021-0089', 'MEM-2022-0234'],
    recommendations: [
      {
        id: 'rec-001',
        loanId: 'LN-2024-001',
        reviewerId: 'usr-008',
        reviewerName: 'Elizabeth Wangari',
        recommendation: 'approve',
        comments: 'Strong business plan, good credit history, adequate collateral. Recommend approval.',
        date: new Date('2024-01-05T14:20:00')
      },
      {
        id: 'rec-002',
        loanId: 'LN-2024-001',
        reviewerId: 'usr-009',
        reviewerName: 'Michael Otieno',
        recommendation: 'approve',
        comments: 'Applicant has demonstrated good repayment capacity. Business projections are realistic.',
        date: new Date('2024-01-05T15:45:00')
      }
    ],
    finalDecision: {
      id: 'dec-001',
      loanId: 'LN-2024-001',
      decidedBy: 'usr-004',
      decision: 'approved',
      amount: 5000000,
      interestRate: 12.5,
      term: 36,
      conditions: ['Monthly financial reporting required', 'Annual business audit'],
      comments: 'Approved as recommended by credit committee',
      decisionDate: new Date('2024-01-08T16:00:00')
    },
    reviewedBy: ['usr-008', 'usr-009', 'usr-004'],
    reviewedDate: new Date('2024-01-08T16:00:00'),
    disbursementDate: new Date('2024-01-12T10:00:00')
  },
  {
    id: 'LN-2024-002',
    applicantName: 'Janet Wambui',
    applicantId: 'MEM-2023-0445',
    applicantEmail: 'janet.wambui@email.com',
    applicantPhone: '+254 733 222333',
    loanType: LoanType.EMERGENCY,
    amount: 500000,
    purpose: 'Medical emergency - specialized treatment',
    term: 12,
    status: LoanStatus.APPROVED,
    submittedDate: new Date('2024-01-05T09:15:00'),
    urgency: LoanUrgency.CRITICAL,
    documents: ['doc-009'],
    creditScore: 680,
    income: 120000,
    guarantors: ['MEM-2020-0567'],
    recommendations: [
      {
        id: 'rec-003',
        loanId: 'LN-2024-002',
        reviewerId: 'usr-008',
        reviewerName: 'Elizabeth Wangari',
        recommendation: 'approve',
        comments: 'Emergency situation requires immediate assistance. Member has good standing.',
        date: new Date('2024-01-08T10:30:00')
      }
    ],
    finalDecision: {
      id: 'dec-002',
      loanId: 'LN-2024-002',
      decidedBy: 'usr-004',
      decision: 'approved',
      amount: 500000,
      interestRate: 10.0,
      term: 12,
      comments: 'Fast-tracked due to emergency nature',
      decisionDate: new Date('2024-01-08T14:00:00')
    },
    reviewedBy: ['usr-008', 'usr-004'],
    reviewedDate: new Date('2024-01-08T14:00:00'),
    disbursementDate: new Date('2024-01-09T09:00:00')
  },
  {
    id: 'LN-2024-003',
    applicantName: 'Robert Ochieng',
    applicantId: 'MEM-2022-0789',
    applicantEmail: 'robert.ochieng@email.com',
    applicantPhone: '+254 744 333444',
    loanType: LoanType.EDUCATION,
    amount: 800000,
    purpose: 'Masters degree program in Business Administration',
    term: 24,
    status: LoanStatus.APPROVED,
    submittedDate: new Date('2024-01-06T11:20:00'),
    urgency: LoanUrgency.MEDIUM,
    documents: ['doc-010'],
    creditScore: 695,
    income: 180000,
    guarantors: ['MEM-2019-0234', 'MEM-2021-0456'],
    recommendations: [
      {
        id: 'rec-004',
        loanId: 'LN-2024-003',
        reviewerId: 'usr-009',
        reviewerName: 'Michael Otieno',
        recommendation: 'approve',
        comments: 'Education investment with good prospects. Applicant has stable employment.',
        date: new Date('2024-01-08T11:15:00')
      }
    ],
    finalDecision: {
      id: 'dec-003',
      loanId: 'LN-2024-003',
      decidedBy: 'usr-004',
      decision: 'approved',
      amount: 800000,
      interestRate: 9.5,
      term: 24,
      conditions: ['Proof of enrollment required before disbursement', 'Grace period of 6 months'],
      decisionDate: new Date('2024-01-08T16:30:00')
    },
    reviewedBy: ['usr-009', 'usr-004'],
    reviewedDate: new Date('2024-01-08T16:30:00')
  },
  {
    id: 'LN-2024-004',
    applicantName: 'Mary Njeri',
    applicantId: 'MEM-2021-0234',
    applicantEmail: 'mary.njeri@email.com',
    applicantPhone: '+254 755 444555',
    loanType: LoanType.AGRICULTURE,
    amount: 2500000,
    purpose: 'Purchase of greenhouse equipment and irrigation system',
    term: 30,
    status: LoanStatus.UNDER_REVIEW,
    submittedDate: new Date('2024-01-10T08:45:00'),
    urgency: LoanUrgency.HIGH,
    documents: ['doc-021', 'doc-022'],
    creditScore: 710,
    income: 250000,
    collateral: 'Agricultural land 5 acres valued at KES 4,000,000',
    guarantors: ['MEM-2020-0123'],
    recommendations: [
      {
        id: 'rec-005',
        loanId: 'LN-2024-004',
        reviewerId: 'usr-008',
        reviewerName: 'Elizabeth Wangari',
        recommendation: 'approve',
        comments: 'Strong agricultural background. Project appears viable with good market prospects.',
        date: new Date('2024-01-15T10:00:00')
      }
    ],
    reviewedBy: ['usr-008']
  },
  {
    id: 'LN-2024-005',
    applicantName: 'David Mwangi',
    applicantId: 'MEM-2023-0567',
    applicantEmail: 'david.mwangi@email.com',
    applicantPhone: '+254 766 555666',
    loanType: LoanType.PERSONAL,
    amount: 1200000,
    purpose: 'Home renovation and improvement',
    term: 18,
    status: LoanStatus.UNDER_REVIEW,
    submittedDate: new Date('2024-01-12T14:30:00'),
    urgency: LoanUrgency.LOW,
    documents: ['doc-023'],
    creditScore: 665,
    income: 195000,
    guarantors: ['MEM-2022-0345', 'MEM-2023-0123'],
    recommendations: [
      {
        id: 'rec-006',
        loanId: 'LN-2024-005',
        reviewerId: 'usr-009',
        reviewerName: 'Michael Otieno',
        recommendation: 'conditional',
        comments: 'Approve with condition of additional guarantor due to debt-to-income ratio.',
        conditions: ['Require third guarantor', 'Reduce term to 15 months'],
        date: new Date('2024-01-16T11:30:00')
      }
    ],
    reviewedBy: ['usr-009']
  },
  {
    id: 'LN-2024-006',
    applicantName: 'Susan Achieng',
    applicantId: 'MEM-2022-0890',
    applicantEmail: 'susan.achieng@email.com',
    applicantPhone: '+254 777 666777',
    loanType: LoanType.BUSINESS,
    amount: 3500000,
    purpose: 'Purchase of delivery vehicles for logistics business',
    term: 24,
    status: LoanStatus.SUBMITTED,
    submittedDate: new Date('2024-01-15T09:00:00'),
    urgency: LoanUrgency.MEDIUM,
    documents: ['doc-024', 'doc-025'],
    creditScore: 700,
    income: 320000,
    collateral: 'Business premises valued at KES 5,500,000',
    guarantors: ['MEM-2021-0678'],
    recommendations: [],
    reviewedBy: []
  },
  {
    id: 'LN-2024-007',
    applicantName: 'Patrick Mutiso',
    applicantId: 'MEM-2020-0456',
    applicantEmail: 'patrick.mutiso@email.com',
    applicantPhone: '+254 788 777888',
    loanType: LoanType.PERSONAL,
    amount: 600000,
    purpose: 'Debt consolidation',
    term: 18,
    status: LoanStatus.REJECTED,
    submittedDate: new Date('2024-01-03T13:45:00'),
    urgency: LoanUrgency.LOW,
    documents: ['doc-026'],
    creditScore: 590,
    income: 95000,
    guarantors: ['MEM-2023-0789'],
    recommendations: [
      {
        id: 'rec-007',
        loanId: 'LN-2024-007',
        reviewerId: 'usr-008',
        reviewerName: 'Elizabeth Wangari',
        recommendation: 'reject',
        comments: 'Credit score below threshold. High debt-to-income ratio. Recent payment defaults.',
        date: new Date('2024-01-08T09:30:00')
      },
      {
        id: 'rec-008',
        loanId: 'LN-2024-007',
        reviewerId: 'usr-009',
        reviewerName: 'Michael Otieno',
        recommendation: 'reject',
        comments: 'Concur with primary review. Applicant needs to improve credit standing first.',
        date: new Date('2024-01-08T10:15:00')
      }
    ],
    finalDecision: {
      id: 'dec-004',
      loanId: 'LN-2024-007',
      decidedBy: 'usr-004',
      decision: 'rejected',
      comments: 'Application does not meet minimum credit requirements. Advised to reapply after 6 months.',
      decisionDate: new Date('2024-01-08T15:00:00')
    },
    reviewedBy: ['usr-008', 'usr-009', 'usr-004'],
    reviewedDate: new Date('2024-01-08T15:00:00')
  },
  {
    id: 'LN-2024-008',
    applicantName: 'Catherine Wangui',
    applicantId: 'MEM-2023-0234',
    applicantEmail: 'catherine.wangui@email.com',
    applicantPhone: '+254 799 888999',
    loanType: LoanType.EMERGENCY,
    amount: 350000,
    purpose: 'Urgent home repair after water damage',
    term: 12,
    status: LoanStatus.UNDER_REVIEW,
    submittedDate: new Date('2024-01-16T07:30:00'),
    urgency: LoanUrgency.HIGH,
    documents: ['doc-027'],
    creditScore: 675,
    income: 140000,
    guarantors: ['MEM-2022-0567'],
    recommendations: [],
    reviewedBy: []
  },
  {
    id: 'LN-2024-009',
    applicantName: 'James Kiprotich',
    applicantId: 'MEM-2021-0789',
    applicantEmail: 'james.kiprotich@email.com',
    applicantPhone: '+254 710 999000',
    loanType: LoanType.AGRICULTURE,
    amount: 1800000,
    purpose: 'Purchase of dairy cattle and milking equipment',
    term: 36,
    status: LoanStatus.SUBMITTED,
    submittedDate: new Date('2024-01-14T10:15:00'),
    urgency: LoanUrgency.MEDIUM,
    documents: ['doc-028'],
    creditScore: 690,
    income: 210000,
    collateral: 'Agricultural land 10 acres valued at KES 3,500,000',
    guarantors: ['MEM-2020-0345', 'MEM-2022-0678'],
    recommendations: [],
    reviewedBy: []
  },
  {
    id: 'LN-2024-010',
    applicantName: 'Alice Nyokabi',
    applicantId: 'MEM-2022-0345',
    applicantEmail: 'alice.nyokabi@email.com',
    applicantPhone: '+254 721 000111',
    loanType: LoanType.EDUCATION,
    amount: 1500000,
    purpose: 'Undergraduate education for daughter - Engineering program',
    term: 48,
    status: LoanStatus.DISBURSED,
    submittedDate: new Date('2023-12-10T09:30:00'),
    urgency: LoanUrgency.HIGH,
    documents: ['doc-029'],
    creditScore: 725,
    income: 280000,
    guarantors: ['MEM-2021-0234', 'MEM-2022-0890'],
    recommendations: [
      {
        id: 'rec-009',
        loanId: 'LN-2024-010',
        reviewerId: 'usr-008',
        reviewerName: 'Elizabeth Wangari',
        recommendation: 'approve',
        comments: 'Excellent credit history. Education loans are priority. Approve.',
        date: new Date('2023-12-18T14:00:00')
      }
    ],
    finalDecision: {
      id: 'dec-005',
      loanId: 'LN-2024-010',
      decidedBy: 'usr-004',
      decision: 'approved',
      amount: 1500000,
      interestRate: 8.5,
      term: 48,
      conditions: ['Direct payment to university', 'Proof of enrollment each semester'],
      decisionDate: new Date('2023-12-20T10:00:00')
    },
    reviewedBy: ['usr-008', 'usr-004'],
    reviewedDate: new Date('2023-12-20T10:00:00'),
    disbursementDate: new Date('2024-01-05T11:00:00')
  },
  {
    id: 'LN-2024-011',
    applicantName: 'George Kimutai',
    applicantId: 'MEM-2023-0678',
    applicantEmail: 'george.kimutai@email.com',
    applicantPhone: '+254 732 111222',
    loanType: LoanType.BUSINESS,
    amount: 4200000,
    purpose: 'Construction of rental apartments',
    term: 60,
    status: LoanStatus.UNDER_REVIEW,
    submittedDate: new Date('2024-01-11T11:45:00'),
    urgency: LoanUrgency.MEDIUM,
    documents: ['doc-030', 'doc-031'],
    creditScore: 715,
    income: 380000,
    collateral: 'Land and building permits valued at KES 7,000,000',
    guarantors: ['MEM-2021-0456', 'MEM-2022-0234'],
    recommendations: [
      {
        id: 'rec-010',
        loanId: 'LN-2024-011',
        reviewerId: 'usr-009',
        reviewerName: 'Michael Otieno',
        recommendation: 'conditional',
        comments: 'Good project but requires phased disbursement based on construction milestones.',
        conditions: ['Phased disbursement', 'Professional quantity surveyor reports required'],
        date: new Date('2024-01-17T09:45:00')
      }
    ],
    reviewedBy: ['usr-009']
  },
  {
    id: 'LN-2024-012',
    applicantName: 'Esther Wanjiku',
    applicantId: 'MEM-2022-0901',
    applicantEmail: 'esther.wanjiku@email.com',
    applicantPhone: '+254 743 222333',
    loanType: LoanType.PERSONAL,
    amount: 900000,
    purpose: 'Wedding expenses',
    term: 24,
    status: LoanStatus.SUBMITTED,
    submittedDate: new Date('2024-01-17T08:20:00'),
    urgency: LoanUrgency.LOW,
    documents: ['doc-032'],
    creditScore: 685,
    income: 165000,
    guarantors: ['MEM-2021-0789', 'MEM-2023-0456'],
    recommendations: [],
    reviewedBy: []
  }
];

export const getLoanById = (id: string): LoanApplication | undefined => {
  return mockLoans.find(loan => loan.id === id);
};

export const getLoansByStatus = (status: LoanStatus): LoanApplication[] => {
  return mockLoans.filter(loan => loan.status === status);
};

export const getLoansByType = (type: LoanType): LoanApplication[] => {
  return mockLoans.filter(loan => loan.loanType === type);
};

export const getLoansByUrgency = (urgency: LoanUrgency): LoanApplication[] => {
  return mockLoans.filter(loan => loan.urgency === urgency);
};

export const getPendingLoans = (): LoanApplication[] => {
  return mockLoans.filter(loan => 
    loan.status === LoanStatus.SUBMITTED || loan.status === LoanStatus.UNDER_REVIEW
  );
};
