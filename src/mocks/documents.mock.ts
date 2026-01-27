import type { Document } from '../types/document.types';
import { DocumentCategory } from '../types/document.types';

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    title: 'Q3 2023 Board Meeting Minutes',
    category: DocumentCategory.MINUTES,
    type: 'application/pdf',
    uploadedBy: 'usr-003',
    uploadedDate: new Date('2023-09-18T14:30:00'),
    size: 245000,
    url: '/documents/minutes/Q3-2023-board-minutes.pdf',
    version: '1.0',
    tags: ['minutes', 'Q3', '2023', 'board'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2023-12-15T09:45:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        action: 'download',
        timestamp: new Date('2023-12-15T10:20:00')
      }
    ],
    isConfidential: false,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Approved minutes from Q3 2023 Board Meeting'
  },
  {
    id: 'doc-002',
    title: 'Q3 2023 Board Meeting Agenda',
    category: DocumentCategory.MINUTES,
    type: 'application/pdf',
    uploadedBy: 'usr-003',
    uploadedDate: new Date('2023-09-10T10:00:00'),
    size: 128000,
    url: '/documents/agendas/Q3-2023-board-agenda.pdf',
    version: '1.0',
    tags: ['agenda', 'Q3', '2023', 'board'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2023-09-10T11:30:00')
      }
    ],
    isConfidential: false,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Meeting agenda for Q3 2023 Board Meeting'
  },
  {
    id: 'doc-003',
    title: 'Q4 2023 Financial Statements',
    category: DocumentCategory.FINANCIAL,
    type: 'application/vnd.ms-excel',
    uploadedBy: 'usr-004',
    uploadedDate: new Date('2023-12-10T16:00:00'),
    size: 589000,
    url: '/documents/financial/Q4-2023-financial-statements.xlsx',
    version: '2.1',
    tags: ['financial', 'Q4', '2023', 'statements'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2023-12-15T10:15:00')
      },
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        action: 'download',
        timestamp: new Date('2023-12-15T11:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        action: 'edit',
        timestamp: new Date('2023-12-14T14:30:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Comprehensive Q4 2023 financial performance report',
    modifiedBy: 'usr-004',
    modifiedDate: new Date('2023-12-14T14:30:00')
  },
  {
    id: 'doc-004',
    title: 'Year-End Projections 2023',
    category: DocumentCategory.FINANCIAL,
    type: 'application/pdf',
    uploadedBy: 'usr-004',
    uploadedDate: new Date('2023-12-12T09:30:00'),
    size: 342000,
    url: '/documents/financial/year-end-projections-2023.pdf',
    version: '1.0',
    tags: ['financial', 'projections', '2023', 'forecast'],
    accessLog: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        action: 'view',
        timestamp: new Date('2023-12-15T09:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Financial projections and forecasts for year-end 2023'
  },
  {
    id: 'doc-005',
    title: 'Credit Portfolio Analysis Q4 2023',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2023-12-13T11:00:00'),
    size: 456000,
    url: '/documents/reports/credit-portfolio-Q4-2023.pdf',
    version: '1.0',
    tags: ['credit', 'portfolio', 'analysis', 'Q4'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2023-12-15T11:30:00')
      },
      {
        userId: 'usr-006',
        userName: 'Mary Akinyi',
        action: 'download',
        timestamp: new Date('2023-12-15T12:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Comprehensive analysis of loan portfolio performance'
  },
  {
    id: 'doc-006',
    title: 'Strategic Plan 2024-2026',
    category: DocumentCategory.POLICY,
    type: 'application/pdf',
    uploadedBy: 'usr-011',
    uploadedDate: new Date('2023-12-08T15:00:00'),
    size: 1245000,
    url: '/documents/strategic/strategic-plan-2024-2026.pdf',
    version: '3.0',
    tags: ['strategic', 'plan', '2024', '2025', '2026'],
    accessLog: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        action: 'view',
        timestamp: new Date('2023-12-15T08:30:00')
      },
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2023-12-15T10:00:00')
      }
    ],
    isConfidential: false,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-001'
    },
    description: 'Three-year strategic plan and initiatives'
  },
  {
    id: 'doc-007',
    title: 'Business Loan Application - Francis Kariuki',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2023-12-20T11:00:00'),
    size: 234000,
    url: '/documents/loans/LN-2024-001-application.pdf',
    version: '1.0',
    tags: ['loan', 'application', 'business', 'LN-2024-001'],
    accessLog: [
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        action: 'view',
        timestamp: new Date('2024-01-05T14:00:00')
      },
      {
        userId: 'usr-009',
        userName: 'Michael Otieno',
        action: 'view',
        timestamp: new Date('2024-01-05T15:30:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-001'
    },
    description: 'Complete loan application with supporting documents'
  },
  {
    id: 'doc-008',
    title: 'Business Plan - Retail Expansion',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2023-12-20T11:15:00'),
    size: 678000,
    url: '/documents/loans/LN-2024-001-business-plan.pdf',
    version: '1.0',
    tags: ['loan', 'business plan', 'LN-2024-001'],
    accessLog: [
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        action: 'view',
        timestamp: new Date('2024-01-05T14:10:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-001'
    },
    description: 'Detailed business plan for retail expansion project'
  },
  {
    id: 'doc-009',
    title: 'Emergency Loan Application - Janet Wambui',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2024-01-05T09:30:00'),
    size: 145000,
    url: '/documents/loans/LN-2024-002-application.pdf',
    version: '1.0',
    tags: ['loan', 'emergency', 'LN-2024-002'],
    accessLog: [
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        action: 'view',
        timestamp: new Date('2024-01-08T10:15:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-002'
    },
    description: 'Emergency loan application with medical documentation'
  },
  {
    id: 'doc-010',
    title: 'Education Loan Application - Robert Ochieng',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-009',
    uploadedDate: new Date('2024-01-06T11:45:00'),
    size: 189000,
    url: '/documents/loans/LN-2024-003-application.pdf',
    version: '1.0',
    tags: ['loan', 'education', 'LN-2024-003'],
    accessLog: [
      {
        userId: 'usr-009',
        userName: 'Michael Otieno',
        action: 'view',
        timestamp: new Date('2024-01-08T11:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-003'
    },
    description: 'Education loan application with admission letter'
  },
  {
    id: 'doc-011',
    title: 'Partnership Proposal - Regional Bank',
    category: DocumentCategory.POLICY,
    type: 'application/pdf',
    uploadedBy: 'usr-001',
    uploadedDate: new Date('2024-01-10T15:30:00'),
    size: 892000,
    url: '/documents/partnerships/regional-bank-proposal.pdf',
    version: '1.0',
    tags: ['partnership', 'proposal', 'strategic'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2024-01-12T08:30:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        action: 'view',
        timestamp: new Date('2024-01-12T09:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-003'
    },
    description: 'Strategic partnership proposal with terms and conditions'
  },
  {
    id: 'doc-012',
    title: 'Partnership Risk Assessment',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-006',
    uploadedDate: new Date('2024-01-11T10:00:00'),
    size: 345000,
    url: '/documents/reports/partnership-risk-assessment.pdf',
    version: '1.0',
    tags: ['risk', 'assessment', 'partnership'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2024-01-12T09:30:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-003'
    },
    description: 'Comprehensive risk analysis of partnership proposal'
  },
  {
    id: 'doc-013',
    title: 'AGM 2024 - Chairperson Report',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-002',
    uploadedDate: new Date('2024-03-01T14:00:00'),
    size: 567000,
    url: '/documents/agm/chairperson-report-2024.pdf',
    version: '1.0',
    tags: ['AGM', '2024', 'chairperson', 'report'],
    accessLog: [],
    isConfidential: false,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-004'
    },
    description: 'Annual report from Board Chairperson for 2023'
  },
  {
    id: 'doc-014',
    title: 'AGM 2024 - CEO Report',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-001',
    uploadedDate: new Date('2024-03-01T14:30:00'),
    size: 678000,
    url: '/documents/agm/ceo-report-2024.pdf',
    version: '1.0',
    tags: ['AGM', '2024', 'CEO', 'report'],
    accessLog: [],
    isConfidential: false,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-004'
    },
    description: 'Annual CEO performance and achievements report'
  },
  {
    id: 'doc-015',
    title: 'Audited Financial Statements 2023',
    category: DocumentCategory.AUDIT,
    type: 'application/pdf',
    uploadedBy: 'usr-007',
    uploadedDate: new Date('2024-02-15T16:00:00'),
    size: 1234000,
    url: '/documents/audit/audited-financials-2023.pdf',
    version: '1.0',
    tags: ['audit', 'financial', '2023', 'statements'],
    accessLog: [
      {
        userId: 'usr-002',
        userName: 'Sarah Wanjiru',
        action: 'view',
        timestamp: new Date('2024-02-16T09:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        action: 'download',
        timestamp: new Date('2024-02-16T10:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-004'
    },
    description: 'Complete audited financial statements for year 2023'
  },
  {
    id: 'doc-016',
    title: 'Internal Audit Report Q4 2023',
    category: DocumentCategory.AUDIT,
    type: 'application/pdf',
    uploadedBy: 'usr-012',
    uploadedDate: new Date('2024-01-15T11:00:00'),
    size: 445000,
    url: '/documents/audit/internal-audit-Q4-2023.pdf',
    version: '1.0',
    tags: ['audit', 'internal', 'Q4', '2023'],
    accessLog: [
      {
        userId: 'usr-007',
        userName: 'James Njoroge',
        action: 'view',
        timestamp: new Date('2024-01-18T10:30:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-005'
    },
    description: 'Internal audit findings and recommendations Q4 2023'
  },
  {
    id: 'doc-017',
    title: 'Compliance Status Report',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-015',
    uploadedDate: new Date('2024-01-17T09:30:00'),
    size: 312000,
    url: '/documents/compliance/compliance-status-jan-2024.pdf',
    version: '1.0',
    tags: ['compliance', 'report', '2024'],
    accessLog: [],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-005'
    },
    description: 'Regulatory compliance status and assessment'
  },
  {
    id: 'doc-018',
    title: 'Budget 2024',
    category: DocumentCategory.FINANCIAL,
    type: 'application/vnd.ms-excel',
    uploadedBy: 'usr-004',
    uploadedDate: new Date('2024-01-20T10:00:00'),
    size: 789000,
    url: '/documents/financial/budget-2024.xlsx',
    version: '2.0',
    tags: ['budget', '2024', 'financial'],
    accessLog: [
      {
        userId: 'usr-001',
        userName: 'John Kamau',
        action: 'view',
        timestamp: new Date('2024-01-20T11:00:00')
      },
      {
        userId: 'usr-004',
        userName: 'Grace Muthoni',
        action: 'edit',
        timestamp: new Date('2024-01-23T14:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-006'
    },
    description: 'Comprehensive budget for fiscal year 2024',
    modifiedBy: 'usr-004',
    modifiedDate: new Date('2024-01-23T14:00:00')
  },
  {
    id: 'doc-019',
    title: 'Staff Performance Review 2023',
    category: DocumentCategory.REPORT,
    type: 'application/pdf',
    uploadedBy: 'usr-010',
    uploadedDate: new Date('2024-01-18T13:00:00'),
    size: 523000,
    url: '/documents/hr/staff-performance-2023.pdf',
    version: '1.0',
    tags: ['HR', 'performance', 'review', '2023'],
    accessLog: [],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-007'
    },
    description: 'Annual staff performance review summary'
  },
  {
    id: 'doc-020',
    title: 'Investment Portfolio Report Q4 2023',
    category: DocumentCategory.FINANCIAL,
    type: 'application/pdf',
    uploadedBy: 'usr-013',
    uploadedDate: new Date('2024-01-25T10:30:00'),
    size: 456000,
    url: '/documents/investment/portfolio-Q4-2023.pdf',
    version: '1.0',
    tags: ['investment', 'portfolio', 'Q4', '2023'],
    accessLog: [],
    isConfidential: true,
    relatedTo: {
      type: 'meeting',
      id: 'mtg-008'
    },
    description: 'Investment portfolio performance and analysis'
  },
  {
    id: 'doc-021',
    title: 'Agriculture Loan Application - Mary Njeri',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2024-01-10T09:00:00'),
    size: 267000,
    url: '/documents/loans/LN-2024-004-application.pdf',
    version: '1.0',
    tags: ['loan', 'agriculture', 'LN-2024-004'],
    accessLog: [
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        action: 'view',
        timestamp: new Date('2024-01-15T09:45:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-004'
    },
    description: 'Agriculture loan application for greenhouse project'
  },
  {
    id: 'doc-022',
    title: 'Greenhouse Project Plan',
    category: DocumentCategory.LOAN,
    type: 'application/pdf',
    uploadedBy: 'usr-008',
    uploadedDate: new Date('2024-01-10T09:15:00'),
    size: 534000,
    url: '/documents/loans/LN-2024-004-project-plan.pdf',
    version: '1.0',
    tags: ['loan', 'agriculture', 'project plan'],
    accessLog: [
      {
        userId: 'usr-008',
        userName: 'Elizabeth Wangari',
        action: 'view',
        timestamp: new Date('2024-01-15T10:00:00')
      }
    ],
    isConfidential: true,
    relatedTo: {
      type: 'loan',
      id: 'LN-2024-004'
    },
    description: 'Detailed project plan for greenhouse farming venture'
  }
];

export const getDocumentById = (id: string): Document | undefined => {
  return mockDocuments.find(doc => doc.id === id);
};

export const getDocumentsByCategory = (category: DocumentCategory): Document[] => {
  return mockDocuments.filter(doc => doc.category === category);
};

export const getConfidentialDocuments = (): Document[] => {
  return mockDocuments.filter(doc => doc.isConfidential);
};

export const getDocumentsByUser = (userId: string): Document[] => {
  return mockDocuments.filter(doc => doc.uploadedBy === userId);
};

export const getRecentDocuments = (limit: number = 10): Document[] => {
  return [...mockDocuments]
    .sort((a, b) => b.uploadedDate.getTime() - a.uploadedDate.getTime())
    .slice(0, limit);
};
