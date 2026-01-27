import { simulateApiDelay, createPaginatedResponse } from './api';
import type { PaginatedResponse } from './api';
import type { LoanApplication, Recommendation, Decision } from '../types/loan.types';
import { LoanStatus, LoanType, LoanUrgency } from '../types/loan.types';
import { mockLoans } from '../mocks';

export interface LoanFilters {
  status?: LoanStatus;
  type?: LoanType;
  urgency?: LoanUrgency;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateLoanData {
  applicantName: string;
  applicantId: string;
  applicantEmail: string;
  applicantPhone: string;
  loanType: LoanType;
  amount: number;
  purpose: string;
  term: number;
  urgency: LoanUrgency;
  documents: string[];
  creditScore?: number;
  income?: number;
  collateral?: string;
  guarantors?: string[];
}

export interface UpdateLoanData {
  status?: LoanStatus;
  amount?: number;
  term?: number;
  urgency?: LoanUrgency;
  documents?: string[];
  creditScore?: number;
  income?: number;
  collateral?: string;
  guarantors?: string[];
}

export interface AddRecommendationData {
  reviewerId: string;
  reviewerName: string;
  recommendation: 'approve' | 'reject' | 'conditional';
  comments: string;
  conditions?: string[];
}

export interface ApproveLoanData {
  decidedBy: string;
  decision: 'approved' | 'rejected';
  amount?: number;
  interestRate?: number;
  term?: number;
  conditions?: string[];
  comments?: string;
}

class LoanService {
  // Local state for mock data
  private loans: LoanApplication[] = [...mockLoans];

  /**
   * Get all loans with optional filters
   */
  async getLoans(filters?: LoanFilters): Promise<PaginatedResponse<LoanApplication>> {
    return simulateApiDelay(() => {
      let filteredLoans = [...this.loans];

      // Apply filters
      if (filters?.status) {
        filteredLoans = filteredLoans.filter(loan => loan.status === filters.status);
      }

      if (filters?.type) {
        filteredLoans = filteredLoans.filter(loan => loan.loanType === filters.type);
      }

      if (filters?.urgency) {
        filteredLoans = filteredLoans.filter(loan => loan.urgency === filters.urgency);
      }

      if (filters?.minAmount) {
        filteredLoans = filteredLoans.filter(loan => loan.amount >= filters.minAmount!);
      }

      if (filters?.maxAmount) {
        filteredLoans = filteredLoans.filter(loan => loan.amount <= filters.maxAmount!);
      }

      if (filters?.startDate) {
        filteredLoans = filteredLoans.filter(loan => loan.submittedDate >= filters.startDate!);
      }

      if (filters?.endDate) {
        filteredLoans = filteredLoans.filter(loan => loan.submittedDate <= filters.endDate!);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLoans = filteredLoans.filter(loan =>
          loan.applicantName.toLowerCase().includes(searchLower) ||
          loan.applicantId.toLowerCase().includes(searchLower) ||
          loan.id.toLowerCase().includes(searchLower) ||
          loan.purpose.toLowerCase().includes(searchLower)
        );
      }

      // Sort by submission date (most recent first)
      filteredLoans.sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime());

      // Paginate
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      return createPaginatedResponse(filteredLoans, page, pageSize);
    }, 600);
  }

  /**
   * Get a single loan by ID
   */
  async getLoanById(id: string): Promise<LoanApplication> {
    return simulateApiDelay(() => {
      const loan = this.loans.find(l => l.id === id);

      if (!loan) {
        throw {
          message: 'Loan application not found',
          code: 'LOAN_NOT_FOUND',
          status: 404,
        };
      }

      return loan;
    }, 400);
  }

  /**
   * Create a new loan application
   */
  async createLoan(data: CreateLoanData): Promise<LoanApplication> {
    return simulateApiDelay(() => {
      // Validate loan amount
      if (data.amount <= 0) {
        throw {
          message: 'Loan amount must be greater than zero',
          code: 'INVALID_LOAN_AMOUNT',
          status: 400,
        };
      }

      // Validate loan term
      if (data.term <= 0 || data.term > 120) {
        throw {
          message: 'Loan term must be between 1 and 120 months',
          code: 'INVALID_LOAN_TERM',
          status: 400,
        };
      }

      const newLoan: LoanApplication = {
        id: `LN-${new Date().getFullYear()}-${String(this.loans.length + 1).padStart(3, '0')}`,
        applicantName: data.applicantName,
        applicantId: data.applicantId,
        applicantEmail: data.applicantEmail,
        applicantPhone: data.applicantPhone,
        loanType: data.loanType,
        amount: data.amount,
        purpose: data.purpose,
        term: data.term,
        status: LoanStatus.SUBMITTED,
        submittedDate: new Date(),
        urgency: data.urgency,
        documents: data.documents,
        creditScore: data.creditScore,
        income: data.income,
        collateral: data.collateral,
        guarantors: data.guarantors,
        recommendations: [],
      };

      this.loans.push(newLoan);

      return newLoan;
    }, 800);
  }

  /**
   * Update an existing loan application
   */
  async updateLoan(id: string, data: UpdateLoanData): Promise<LoanApplication> {
    return simulateApiDelay(() => {
      const loanIndex = this.loans.findIndex(l => l.id === id);

      if (loanIndex === -1) {
        throw {
          message: 'Loan application not found',
          code: 'LOAN_NOT_FOUND',
          status: 404,
        };
      }

      const loan = this.loans[loanIndex]!;

      // Check if loan can be updated
      if (loan.status === LoanStatus.DISBURSED) {
        throw {
          message: 'Cannot update a disbursed loan',
          code: 'LOAN_DISBURSED',
          status: 400,
        };
      }

      // Validate amount if provided
      if (data.amount !== undefined && data.amount <= 0) {
        throw {
          message: 'Loan amount must be greater than zero',
          code: 'INVALID_LOAN_AMOUNT',
          status: 400,
        };
      }

      // Validate term if provided
      if (data.term !== undefined && (data.term <= 0 || data.term > 120)) {
        throw {
          message: 'Loan term must be between 1 and 120 months',
          code: 'INVALID_LOAN_TERM',
          status: 400,
        };
      }

      // Update loan
      const updatedLoan: LoanApplication = {
        id: loan.id,
        applicantName: loan.applicantName,
        applicantId: loan.applicantId,
        applicantEmail: loan.applicantEmail,
        applicantPhone: loan.applicantPhone,
        loanType: loan.loanType,
        amount: data.amount ?? loan.amount,
        purpose: loan.purpose,
        term: data.term ?? loan.term,
        status: data.status ?? loan.status,
        submittedDate: loan.submittedDate,
        urgency: data.urgency ?? loan.urgency,
        documents: data.documents ?? loan.documents,
        creditScore: data.creditScore ?? loan.creditScore,
        income: data.income ?? loan.income,
        collateral: data.collateral ?? loan.collateral,
        guarantors: data.guarantors ?? loan.guarantors,
        recommendations: loan.recommendations,
        finalDecision: loan.finalDecision,
        reviewedBy: loan.reviewedBy,
      };

      this.loans[loanIndex] = updatedLoan;

      return updatedLoan;
    }, 700);
  }

  /**
   * Add a recommendation to a loan
   */
  async addRecommendation(loanId: string, data: AddRecommendationData): Promise<Recommendation> {
    return simulateApiDelay(() => {
      const loan = this.loans.find(l => l.id === loanId);

      if (!loan) {
        throw {
          message: 'Loan application not found',
          code: 'LOAN_NOT_FOUND',
          status: 404,
        };
      }

      // Check if loan can receive recommendations
      if (loan.status === LoanStatus.SUBMITTED) {
        // Update status to under review
        loan.status = LoanStatus.UNDER_REVIEW;
      } else if (loan.status === LoanStatus.APPROVED || loan.status === LoanStatus.REJECTED || loan.status === LoanStatus.DISBURSED) {
        throw {
          message: 'Cannot add recommendation to a finalized loan',
          code: 'LOAN_FINALIZED',
          status: 400,
        };
      }

      // Check if reviewer has already submitted a recommendation
      const existingRecommendation = loan.recommendations.find(
        r => r.reviewerId === data.reviewerId
      );

      if (existingRecommendation) {
        throw {
          message: 'You have already submitted a recommendation for this loan',
          code: 'RECOMMENDATION_EXISTS',
          status: 400,
        };
      }

      const newRecommendation: Recommendation = {
        id: `rec-${Date.now()}`,
        loanId: loanId,
        reviewerId: data.reviewerId,
        reviewerName: data.reviewerName,
        recommendation: data.recommendation,
        comments: data.comments,
        conditions: data.conditions,
        date: new Date(),
      };

      loan.recommendations.push(newRecommendation);

      // Update reviewedBy
      if (!loan.reviewedBy) {
        loan.reviewedBy = [];
      }
      loan.reviewedBy.push(data.reviewerId);

      return newRecommendation;
    }, 800);
  }

  /**
   * Approve or reject a loan (final decision)
   */
  async approveLoan(loanId: string, data: ApproveLoanData): Promise<Decision> {
    return simulateApiDelay(() => {
      const loan = this.loans.find(l => l.id === loanId);

      if (!loan) {
        throw {
          message: 'Loan application not found',
          code: 'LOAN_NOT_FOUND',
          status: 404,
        };
      }

      // Check if loan can be decided
      if (loan.status !== LoanStatus.UNDER_REVIEW) {
        throw {
          message: 'Loan must be under review before final decision',
          code: 'INVALID_LOAN_STATUS',
          status: 400,
        };
      }

      // Check if there are recommendations
      if (loan.recommendations.length === 0) {
        throw {
          message: 'Loan must have at least one recommendation before final decision',
          code: 'NO_RECOMMENDATIONS',
          status: 400,
        };
      }

      const decision: Decision = {
        id: `dec-${Date.now()}`,
        loanId: loanId,
        decidedBy: data.decidedBy,
        decision: data.decision,
        amount: data.amount || loan.amount,
        interestRate: data.interestRate,
        term: data.term || loan.term,
        conditions: data.conditions,
        comments: data.comments,
        decisionDate: new Date(),
      };

      loan.finalDecision = decision;
      loan.status = data.decision === 'approved' ? LoanStatus.APPROVED : LoanStatus.REJECTED;
      loan.reviewedDate = new Date();

      // Add decider to reviewedBy
      if (!loan.reviewedBy) {
        loan.reviewedBy = [];
      }
      if (!loan.reviewedBy.includes(data.decidedBy)) {
        loan.reviewedBy.push(data.decidedBy);
      }

      return decision;
    }, 900);
  }

  /**
   * Get loans pending review
   */
  async getPendingLoans(): Promise<LoanApplication[]> {
    return simulateApiDelay(() => {
      return this.loans
        .filter(loan => 
          loan.status === LoanStatus.SUBMITTED || 
          loan.status === LoanStatus.UNDER_REVIEW
        )
        .sort((a, b) => {
          // Sort by urgency first
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          if (urgencyDiff !== 0) return urgencyDiff;
          
          // Then by submission date
          return a.submittedDate.getTime() - b.submittedDate.getTime();
        });
    }, 500);
  }

  /**
   * Get loan statistics
   */
  async getLoanStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    disbursed: number;
    totalAmount: number;
    approvedAmount: number;
  }> {
    return simulateApiDelay(() => {
      const total = this.loans.length;
      const pending = this.loans.filter(l => 
        l.status === LoanStatus.SUBMITTED || l.status === LoanStatus.UNDER_REVIEW
      ).length;
      const approved = this.loans.filter(l => l.status === LoanStatus.APPROVED).length;
      const rejected = this.loans.filter(l => l.status === LoanStatus.REJECTED).length;
      const disbursed = this.loans.filter(l => l.status === LoanStatus.DISBURSED).length;
      
      const totalAmount = this.loans.reduce((sum, loan) => sum + loan.amount, 0);
      const approvedAmount = this.loans
        .filter(l => l.status === LoanStatus.APPROVED || l.status === LoanStatus.DISBURSED)
        .reduce((sum, loan) => sum + loan.amount, 0);

      return {
        total,
        pending,
        approved,
        rejected,
        disbursed,
        totalAmount,
        approvedAmount,
      };
    }, 400);
  }

  /**
   * Disburse an approved loan
   */
  async disburseLoan(loanId: string): Promise<LoanApplication> {
    return simulateApiDelay(() => {
      const loan = this.loans.find(l => l.id === loanId);

      if (!loan) {
        throw {
          message: 'Loan application not found',
          code: 'LOAN_NOT_FOUND',
          status: 404,
        };
      }

      if (loan.status !== LoanStatus.APPROVED) {
        throw {
          message: 'Only approved loans can be disbursed',
          code: 'LOAN_NOT_APPROVED',
          status: 400,
        };
      }

      loan.status = LoanStatus.DISBURSED;
      loan.disbursementDate = new Date();

      return loan;
    }, 700);
  }
}

export default new LoanService();
