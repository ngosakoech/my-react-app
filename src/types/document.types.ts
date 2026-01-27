export const DocumentCategory = {
  MINUTES: 'minutes',
  FINANCIAL: 'financial',
  POLICY: 'policy',
  LOAN: 'loan',
  AUDIT: 'audit',
  REPORT: 'report',
  OTHER: 'other'
} as const;

export type DocumentCategory = (typeof DocumentCategory)[keyof typeof DocumentCategory];

export interface AccessLog {
  userId: string;
  userName: string;
  action: 'view' | 'download' | 'edit' | 'delete';
  timestamp: Date;
  ipAddress?: string;
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  type: string;
  uploadedBy: string;
  uploadedDate: Date;
  size: number;
  url: string;
  version: string;
  tags: string[];
  accessLog: AccessLog[];
  isConfidential: boolean;
  expiryDate?: Date;
  relatedTo?: {
    type: 'meeting' | 'loan' | 'resolution';
    id: string;
  };
  description?: string;
  modifiedBy?: string;
  modifiedDate?: Date;
}
