import { z } from 'zod';
import { UserRole } from '../types/auth.types';
import { MeetingType, MeetingStatus } from '../types/meeting.types';
import { DocumentCategory } from '../types/document.types';
import { VotingRule } from '../types/voting.types';
import { LoanType, LoanUrgency } from '../types/loan.types';
import { FILE_SIZE_LIMITS } from './constants';

/**
 * Login schema validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * User schema validation
 */
export const userSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  role: z.nativeEnum(UserRole, {
    message: 'Please select a valid role',
  }),
  position: z.string().optional(),
  department: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s()+-]+$/.test(val),
      'Invalid phone number format'
    ),
  isActive: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;

/**
 * Meeting schema validation
 */
export const meetingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  date: z.coerce.date({
    message: 'Date is required',
  }),
  time: z
    .string()
    .min(1, 'Time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(3, 'Location must be at least 3 characters'),
  type: z.nativeEnum(MeetingType, {
    message: 'Please select a valid meeting type',
  }),
  status: z.nativeEnum(MeetingStatus).optional(),
  agenda: z
    .array(
      z.object({
        title: z.string().min(1, 'Agenda item title is required'),
        description: z.string().min(1, 'Description is required'),
        presenter: z.string().min(1, 'Presenter is required'),
        duration: z
          .number()
          .min(1, 'Duration must be at least 1 minute')
          .max(480, 'Duration cannot exceed 8 hours'),
        order: z.number().optional(),
      })
    )
    .min(1, 'At least one agenda item is required'),
  attendees: z
    .array(z.string())
    .min(1, 'At least one attendee is required'),
  documents: z.array(z.string()).optional(),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;

/**
 * Loan application schema validation
 */
export const loanSchema = z.object({
  applicantName: z
    .string()
    .min(1, 'Applicant name is required')
    .min(3, 'Name must be at least 3 characters'),
  applicantEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  applicantPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s()+-]+$/, 'Invalid phone number format'),
  loanType: z.nativeEnum(LoanType, {
    message: 'Please select a loan type',
  }),
  amount: z
    .number({
      message: 'Loan amount is required',
    })
    .positive('Amount must be greater than 0')
    .max(10000000, 'Amount cannot exceed 10,000,000'),
  purpose: z
    .string()
    .min(1, 'Loan purpose is required')
    .min(10, 'Purpose must be at least 10 characters')
    .max(500, 'Purpose must be less than 500 characters'),
  term: z
    .number({
      message: 'Loan term is required',
    })
    .int('Term must be a whole number')
    .positive('Term must be greater than 0')
    .max(360, 'Term cannot exceed 360 months'),
  urgency: z.nativeEnum(LoanUrgency, {
    message: 'Please select urgency level',
  }),
  creditScore: z
    .number()
    .int()
    .min(300, 'Credit score must be at least 300')
    .max(850, 'Credit score cannot exceed 850')
    .optional(),
  income: z
    .number()
    .positive('Income must be greater than 0')
    .optional(),
  collateral: z.string().optional(),
  guarantors: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

export type LoanFormData = z.infer<typeof loanSchema>;

/**
 * Loan recommendation schema
 */
export const loanRecommendationSchema = z.object({
  recommendation: z.enum(['approve', 'reject', 'conditional']),
  comments: z
    .string()
    .min(1, 'Comments are required')
    .min(10, 'Comments must be at least 10 characters')
    .max(1000, 'Comments must be less than 1000 characters'),
  conditions: z.array(z.string()).optional(),
});

export type LoanRecommendationFormData = z.infer<typeof loanRecommendationSchema>;

/**
 * Document upload schema validation
 */
export const documentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  category: z.nativeEnum(DocumentCategory, {
    message: 'Please select a category',
  }),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
  expiryDate: z.date().optional(),
  relatedTo: z
    .object({
      type: z.enum(['meeting', 'loan', 'resolution']),
      id: z.string(),
    })
    .optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

/**
 * File upload validation schema
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File is required')
    .refine(
      (file) => file.size <= FILE_SIZE_LIMITS.DOCUMENT,
      `File size must be less than ${FILE_SIZE_LIMITS.DOCUMENT / (1024 * 1024)}MB`
    ),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

/**
 * Resolution/Voting schema validation
 */
export const resolutionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  votingDeadline: z.coerce.date({
    message: 'Voting deadline is required',
  }),
  votingRule: z.nativeEnum(VotingRule, {
    message: 'Please select a voting rule',
  }),
  isAnonymous: z.boolean().default(false),
  category: z.string().optional(),
  relatedMeetingId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export type ResolutionFormData = z.infer<typeof resolutionSchema>;

/**
 * Vote submission schema
 */
export const voteSchema = z.object({
  decision: z.enum(['yes', 'no', 'abstain']),
  comment: z
    .string()
    .max(500, 'Comment must be less than 500 characters')
    .optional(),
});

export type VoteFormData = z.infer<typeof voteSchema>;

/**
 * Meeting minutes schema
 */
export const minutesSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .min(50, 'Minutes must be at least 50 characters'),
  attachments: z.array(z.string()).optional(),
});

export type MinutesFormData = z.infer<typeof minutesSchema>;

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s()+-]+$/.test(val),
      'Invalid phone number format'
    ),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  avatar: z.string().optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

/**
 * Password change schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Search/Filter schema
 */
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

/**
 * Comment schema
 */
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
  isPrivate: z.boolean().default(false),
});

export type CommentFormData = z.infer<typeof commentSchema>;
