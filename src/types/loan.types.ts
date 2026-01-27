export enum LoanType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  MORTGAGE = 'MORTGAGE',
  EMERGENCY = 'EMERGENCY'
}

export enum LoanStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  WITHDRAWN = 'WITHDRAWN',
  CANCELLED = 'CANCELLED'
}

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  loanType: LoanType;
  status: LoanStatus;
  requestedAmount: number;
  approvedAmount?: number;
  purpose: string;
  term: number;
  interestRate?: number;
  monthlyPayment?: number;
  collateral?: CollateralInfo;
  employmentInfo: EmploymentInfo;
  financialInfo: FinancialInfo;
  documents: string[];
  recommendations: Recommendation[];
  decision?: Decision;
  reviewedBy?: string[];
  submittedAt: Date;
  reviewedAt?: Date;
  decidedAt?: Date;
  disbursedAt?: Date;
  expectedDisbursementDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface CollateralInfo {
  type: string;
  description: string;
  estimatedValue: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationDocument?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface EmploymentInfo {
  employer: string;
  position: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'SELF_EMPLOYED';
  monthlyIncome: number;
  yearsEmployed: number;
  employerContact?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface FinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebts: Debt[];
  assets: Asset[];
  creditScore?: number;
  bankStatements?: string[];
}

export interface Debt {
  type: string;
  creditor: string;
  outstandingAmount: number;
  monthlyPayment: number;
}

export interface Asset {
  type: string;
  description: string;
  estimatedValue: number;
}

export interface Recommendation {
  id: string;
  loanApplicationId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  recommendation: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'DEFER';
  recommendedAmount?: number;
  comments: string;
  conditions?: string[];
  riskAssessment?: RiskAssessment;
  submittedAt: Date;
  updatedAt?: Date;
}

export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  factors: {
    creditRisk: number;
    collateralRisk: number;
    incomeStability: number;
    debtToIncomeRatio: number;
  };
  overallScore: number;
  notes?: string;
}

export interface Decision {
  id: string;
  loanApplicationId: string;
  decision: 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL';
  approvedAmount?: number;
  conditions?: string[];
  terms?: LoanTerms;
  reason?: string;
  decidedBy: string;
  decidedByName: string;
  decidedAt: Date;
  validUntil?: Date;
  notes?: string;
}

export interface LoanTerms {
  principal: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  startDate?: Date;
  endDate?: Date;
  paymentSchedule?: PaymentSchedule[];
  latePaymentFee?: number;
  earlyRepaymentPenalty?: number;
}

export interface PaymentSchedule {
  paymentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  remainingBalance: number;
}

export interface LoanDisbursement {
  id: string;
  loanApplicationId: string;
  amount: number;
  disbursementMethod: 'BANK_TRANSFER' | 'CHECK' | 'CASH';
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  disbursedBy: string;
  disbursedAt: Date;
  transactionReference?: string;
  notes?: string;
}

export interface LoanRepayment {
  id: string;
  loanApplicationId: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  paymentDate: Date;
  paymentMethod: 'BANK_TRANSFER' | 'CHECK' | 'CASH' | 'DEDUCTION';
  transactionReference?: string;
  remainingBalance: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  notes?: string;
}
