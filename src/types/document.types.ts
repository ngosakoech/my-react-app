import { UserRole } from './auth.types';

export enum DocumentCategory {
  POLICIES = 'POLICIES',
  MINUTES = 'MINUTES',
  REPORTS = 'REPORTS',
  FINANCIALS = 'FINANCIALS',
  LOANS = 'LOANS',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  version: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata: DocumentMetadata;
  accessControl: AccessControl;
  isConfidential: boolean;
  expiryDate?: Date;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface DocumentMetadata {
  author?: string;
  department?: string;
  fiscalYear?: string;
  meetingDate?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  reviewers?: string[];
  customFields?: Record<string, any>;
}

export interface AccessControl {
  allowedRoles: UserRole[];
  allowedUsers?: string[];
  deniedUsers?: string[];
  isPublic: boolean;
  requiresApproval: boolean;
  downloadable: boolean;
  printable: boolean;
  shareable: boolean;
}

export interface AccessLog {
  id: string;
  documentId: string;
  documentTitle: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: DocumentAction;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

export enum DocumentAction {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  PRINT = 'PRINT',
  COMMENT = 'COMMENT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  changeLog?: string;
  isCurrent: boolean;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentCommentId?: string;
  replies?: DocumentComment[];
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  sharedBy: string;
  sharedByName: string;
  sharedWith: string[];
  sharedWithEmails?: string[];
  shareLink?: string;
  expiresAt?: Date;
  allowDownload: boolean;
  requiresPassword: boolean;
  password?: string;
  accessCount: number;
  message?: string;
  createdAt: Date;
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  approverId: string;
  approverName: string;
  approverRole: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  comments?: string;
  reviewedAt?: Date;
  order: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: DocumentCategory;
  templateUrl: string;
  thumbnailUrl?: string;
  fields: TemplateField[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface DocumentFolder {
  id: string;
  name: string;
  description?: string;
  parentFolderId?: string;
  path: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
  subfolderCount: number;
  accessControl: AccessControl;
}
