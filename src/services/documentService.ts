import { simulateApiDelay, createPaginatedResponse } from './api';
import type { PaginatedResponse } from './api';
import type { Document, AccessLog } from '../types/document.types';
import { DocumentCategory } from '../types/document.types';
import { mockDocuments } from '../mocks';

export interface DocumentFilters {
  category?: DocumentCategory;
  isConfidential?: boolean;
  uploadedBy?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  relatedToType?: 'meeting' | 'loan' | 'resolution';
  relatedToId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UploadDocumentData {
  title: string;
  category: DocumentCategory;
  type: string;
  file: File;
  tags?: string[];
  isConfidential?: boolean;
  description?: string;
  expiryDate?: Date;
  relatedTo?: {
    type: 'meeting' | 'loan' | 'resolution';
    id: string;
  };
}

export interface UpdateDocumentData {
  title?: string;
  category?: DocumentCategory;
  tags?: string[];
  isConfidential?: boolean;
  description?: string;
  expiryDate?: Date;
}

class DocumentService {
  // Local state for mock data
  private documents: Document[] = [...mockDocuments];

  /**
   * Get all documents with optional filters
   */
  async getDocuments(filters?: DocumentFilters): Promise<PaginatedResponse<Document>> {
    return simulateApiDelay(() => {
      let filteredDocuments = [...this.documents];

      // Apply filters
      if (filters?.category) {
        filteredDocuments = filteredDocuments.filter(doc => doc.category === filters.category);
      }

      if (filters?.isConfidential !== undefined) {
        filteredDocuments = filteredDocuments.filter(doc => doc.isConfidential === filters.isConfidential);
      }

      if (filters?.uploadedBy) {
        filteredDocuments = filteredDocuments.filter(doc => doc.uploadedBy === filters.uploadedBy);
      }

      if (filters?.startDate) {
        filteredDocuments = filteredDocuments.filter(doc => doc.uploadedDate >= filters.startDate!);
      }

      if (filters?.endDate) {
        filteredDocuments = filteredDocuments.filter(doc => doc.uploadedDate <= filters.endDate!);
      }

      if (filters?.tags && filters.tags.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc =>
          filters.tags!.some(tag => doc.tags.includes(tag))
        );
      }

      if (filters?.relatedToType && filters?.relatedToId) {
        filteredDocuments = filteredDocuments.filter(doc =>
          doc.relatedTo?.type === filters.relatedToType &&
          doc.relatedTo?.id === filters.relatedToId
        );
      } else if (filters?.relatedToType) {
        filteredDocuments = filteredDocuments.filter(doc =>
          doc.relatedTo?.type === filters.relatedToType
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Sort by upload date (most recent first)
      filteredDocuments.sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime());

      // Paginate
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      return createPaginatedResponse(filteredDocuments, page, pageSize);
    }, 600);
  }

  /**
   * Get a single document by ID
   */
  async getDocumentById(id: string): Promise<Document> {
    return simulateApiDelay(() => {
      const document = this.documents.find(doc => doc.id === id);

      if (!document) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      return document;
    }, 400);
  }

  /**
   * Upload a new document (mock)
   */
  async uploadDocument(data: UploadDocumentData): Promise<Document> {
    return simulateApiDelay(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Validate file size (max 10MB for demo)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.size > maxSize) {
        throw {
          message: 'File size exceeds maximum allowed size of 10MB',
          code: 'FILE_TOO_LARGE',
          status: 400,
        };
      }

      // Validate file type (for demo, accept common document types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
      ];

      if (!allowedTypes.includes(data.type)) {
        throw {
          message: 'File type not supported',
          code: 'INVALID_FILE_TYPE',
          status: 400,
        };
      }

      // Create mock URL (in real app, this would be from cloud storage)
      const fileExtension = data.file.name.split('.').pop();
      const mockUrl = `/documents/${data.category}/${Date.now()}.${fileExtension}`;

      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        title: data.title,
        category: data.category,
        type: data.type,
        uploadedBy: currentUser.id || 'usr-001',
        uploadedDate: new Date(),
        size: data.file.size,
        url: mockUrl,
        version: '1.0',
        tags: data.tags || [],
        accessLog: [],
        isConfidential: data.isConfidential || false,
        expiryDate: data.expiryDate,
        relatedTo: data.relatedTo,
        description: data.description,
      };

      this.documents.push(newDocument);

      return newDocument;
    }, 1200);
  }

  /**
   * Update document metadata
   */
  async updateDocument(id: string, data: UpdateDocumentData): Promise<Document> {
    return simulateApiDelay(() => {
      const docIndex = this.documents.findIndex(doc => doc.id === id);

      if (docIndex === -1) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const document = this.documents[docIndex]!;

      // Update document
      const updatedDocument: Document = {
        id: document.id,
        title: data.title ?? document.title,
        category: data.category ?? document.category,
        type: document.type,
        uploadedBy: document.uploadedBy,
        uploadedDate: document.uploadedDate,
        size: document.size,
        url: document.url,
        version: document.version,
        tags: data.tags ?? document.tags,
        accessLog: document.accessLog,
        isConfidential: data.isConfidential ?? document.isConfidential,
        expiryDate: data.expiryDate ?? document.expiryDate,
        relatedTo: document.relatedTo,
        modifiedBy: currentUser.id || 'usr-001',
        modifiedDate: new Date(),
      };

      this.documents[docIndex] = updatedDocument;

      return updatedDocument;
    }, 700);
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(() => {
      const docIndex = this.documents.findIndex(doc => doc.id === id);

      if (docIndex === -1) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      const document = this.documents[docIndex]!;
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Check permissions (only uploader or admin can delete)
      if (document.uploadedBy !== currentUser.id && currentUser.role !== 'admin') {
        throw {
          message: 'You do not have permission to delete this document',
          code: 'INSUFFICIENT_PERMISSIONS',
          status: 403,
        };
      }

      this.documents.splice(docIndex, 1);

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    }, 600);
  }

  /**
   * Get document download URL
   */
  async downloadDocument(id: string): Promise<{ url: string; filename: string }> {
    return simulateApiDelay(() => {
      const document = this.documents.find(doc => doc.id === id);

      if (!document) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      // Log access
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      this.logAccessInternal(id, currentUser.id, currentUser.firstName + ' ' + currentUser.lastName, 'download');

      // Return mock download URL
      return {
        url: document.url,
        filename: `${document.title}.${document.type.split('/').pop()}`,
      };
    }, 500);
  }

  /**
   * Log document access
   */
  async logAccess(documentId: string, userId: string): Promise<void> {
    return simulateApiDelay(() => {
      const document = this.documents.find(doc => doc.id === documentId);

      if (!document) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User';

      this.logAccessInternal(documentId, userId, userName, 'view');
    }, 300);
  }

  /**
   * Internal method to log access
   */
  private logAccessInternal(
    documentId: string,
    userId: string,
    userName: string,
    action: 'view' | 'download' | 'edit' | 'delete'
  ): void {
    const document = this.documents.find(doc => doc.id === documentId);

    if (document) {
      const accessLog: AccessLog = {
        userId,
        userName,
        action,
        timestamp: new Date(),
      };

      document.accessLog.push(accessLog);
    }
  }

  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: DocumentCategory): Promise<Document[]> {
    return simulateApiDelay(() => {
      return this.documents
        .filter(doc => doc.category === category)
        .sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime());
    }, 400);
  }

  /**
   * Get recent documents
   */
  async getRecentDocuments(limit: number = 10): Promise<Document[]> {
    return simulateApiDelay(() => {
      return this.documents
        .sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime())
        .slice(0, limit);
    }, 400);
  }

  /**
   * Search documents by tags
   */
  async searchByTags(tags: string[]): Promise<Document[]> {
    return simulateApiDelay(() => {
      return this.documents
        .filter(doc => tags.some(tag => doc.tags.includes(tag)))
        .sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime());
    }, 500);
  }

  /**
   * Get expired or expiring documents
   */
  async getExpiringDocuments(daysBeforeExpiry: number = 30): Promise<Document[]> {
    return simulateApiDelay(() => {
      const now = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysBeforeExpiry);

      return this.documents
        .filter(doc => {
          if (!doc.expiryDate) return false;
          return doc.expiryDate <= thresholdDate && doc.expiryDate >= now;
        })
        .sort((a, b) => a.expiryDate!.getTime() - b.expiryDate!.getTime());
    }, 500);
  }

  /**
   * Get document access history
   */
  async getAccessHistory(documentId: string): Promise<AccessLog[]> {
    return simulateApiDelay(() => {
      const document = this.documents.find(doc => doc.id === documentId);

      if (!document) {
        throw {
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        };
      }

      return document.accessLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, 400);
  }

  /**
   * Get document statistics
   */
  async getDocumentStatistics(): Promise<{
    total: number;
    byCategory: Record<DocumentCategory, number>;
    confidential: number;
    totalSize: number;
  }> {
    return simulateApiDelay(() => {
      const total = this.documents.length;
      const confidential = this.documents.filter(doc => doc.isConfidential).length;
      const totalSize = this.documents.reduce((sum, doc) => sum + doc.size, 0);

      const byCategory: Record<string, number> = {};
      Object.values(DocumentCategory).forEach(category => {
        byCategory[category] = this.documents.filter(doc => doc.category === category).length;
      });

      return {
        total,
        byCategory: byCategory as Record<DocumentCategory, number>,
        confidential,
        totalSize,
      };
    }, 400);
  }
}

export default new DocumentService();
