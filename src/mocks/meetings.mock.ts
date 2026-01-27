import type { Meeting } from '../types/meeting.types';
import { MeetingType, MeetingStatus } from '../types/meeting.types';

export const mockMeetings: Meeting[] = [
  {
    id: 'mtg-001',
    title: 'Q4 2023 Board Meeting',
    date: new Date('2023-12-15T10:00:00'),
    time: '10:00 AM - 2:00 PM',
    location: 'Main Conference Room, 5th Floor',
    type: MeetingType.BOARD,
    status: MeetingStatus.COMPLETED,
    agenda: [
      {
        id: 'ag-001-01',
        order: 1,
        title: 'Opening Prayer and Roll Call',
        description: 'Confirmation of quorum and welcome remarks',
        presenter: 'Sarah Wanjiru',
        duration: 10,
        isCompleted: true
      },
      {
        id: 'ag-001-02',
        order: 2,
        title: 'Approval of Previous Minutes',
        description: 'Review and approve minutes from Q3 2023 meeting',
        presenter: 'Peter Omondi',
        duration: 15,
        documents: ['doc-001', 'doc-002'],
        isCompleted: true
      },
      {
        id: 'ag-001-03',
        order: 3,
        title: 'Financial Performance Review',
        description: 'Q4 financial statements and year-end projections',
        presenter: 'Grace Muthoni',
        duration: 45,
        documents: ['doc-003', 'doc-004'],
        isCompleted: true
      },
      {
        id: 'ag-001-04',
        order: 4,
        title: 'Credit Portfolio Analysis',
        description: 'Review of loan portfolio performance and risk assessment',
        presenter: 'Elizabeth Wangari',
        duration: 30,
        documents: ['doc-005'],
        isCompleted: true
      },
      {
        id: 'ag-001-05',
        order: 5,
        title: 'Strategic Plan 2024-2026',
        description: 'Presentation and discussion of new strategic initiatives',
        presenter: 'Daniel Mutua',
        duration: 60,
        documents: ['doc-006'],
        isCompleted: true
      },
      {
        id: 'ag-001-06',
        order: 6,
        title: 'IT Infrastructure Upgrade Proposal',
        description: 'Budget approval for technology modernization',
        presenter: 'Anne Wambui',
        duration: 30,
        isCompleted: true
      },
      {
        id: 'ag-001-07',
        order: 7,
        title: 'Any Other Business and Closing',
        description: 'General matters and closing remarks',
        presenter: 'Sarah Wanjiru',
        duration: 20,
        isCompleted: true
      }
    ],
    attendees: ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007', 'usr-011', 'usr-014', 'usr-016'],
    documents: ['doc-001', 'doc-002', 'doc-003', 'doc-004', 'doc-005', 'doc-006'],
    minutes: {
      id: 'min-001',
      meetingId: 'mtg-001',
      content: 'Complete minutes of Q4 2023 Board Meeting...',
      preparedBy: 'usr-003',
      preparedDate: new Date('2023-12-16T10:00:00'),
      approvedBy: 'usr-002',
      approvedDate: new Date('2023-12-18T14:00:00'),
      isApproved: true
    },
    createdBy: 'usr-003',
    createdDate: new Date('2023-11-30T09:00:00')
  },
  {
    id: 'mtg-002',
    title: 'Credit Committee Meeting - January 2024',
    date: new Date('2024-01-08T14:00:00'),
    time: '2:00 PM - 4:00 PM',
    location: 'Credit Committee Room, 3rd Floor',
    type: MeetingType.SUBCOMMITTEE,
    status: MeetingStatus.COMPLETED,
    agenda: [
      {
        id: 'ag-002-01',
        order: 1,
        title: 'Meeting Opening',
        description: 'Attendance and agenda confirmation',
        presenter: 'Elizabeth Wangari',
        duration: 5,
        isCompleted: true
      },
      {
        id: 'ag-002-02',
        order: 2,
        title: 'Review Loan Application - LN-2024-001',
        description: 'Business loan application for KES 5,000,000',
        presenter: 'Michael Otieno',
        duration: 25,
        documents: ['doc-007', 'doc-008'],
        isCompleted: true
      },
      {
        id: 'ag-002-03',
        order: 3,
        title: 'Review Loan Application - LN-2024-002',
        description: 'Emergency loan for KES 500,000',
        presenter: 'Elizabeth Wangari',
        duration: 20,
        documents: ['doc-009'],
        isCompleted: true
      },
      {
        id: 'ag-002-04',
        order: 4,
        title: 'Review Loan Application - LN-2024-003',
        description: 'Education loan for KES 800,000',
        presenter: 'Michael Otieno',
        duration: 20,
        documents: ['doc-010'],
        isCompleted: true
      },
      {
        id: 'ag-002-05',
        order: 5,
        title: 'Portfolio Performance Update',
        description: 'December 2023 loan portfolio status',
        presenter: 'Elizabeth Wangari',
        duration: 20,
        isCompleted: true
      },
      {
        id: 'ag-002-06',
        order: 6,
        title: 'Policy Review Discussion',
        description: 'Proposed amendments to credit policy',
        presenter: 'Michael Otieno',
        duration: 30,
        isCompleted: true
      }
    ],
    attendees: ['usr-004', 'usr-008', 'usr-009'],
    documents: ['doc-007', 'doc-008', 'doc-009', 'doc-010'],
    createdBy: 'usr-008',
    createdDate: new Date('2024-01-02T10:00:00')
  },
  {
    id: 'mtg-003',
    title: 'Emergency Board Meeting - Strategic Partnership',
    date: new Date('2024-01-12T09:00:00'),
    time: '9:00 AM - 11:00 AM',
    location: 'Virtual Meeting (Zoom)',
    type: MeetingType.EMERGENCY,
    status: MeetingStatus.COMPLETED,
    agenda: [
      {
        id: 'ag-003-01',
        order: 1,
        title: 'Meeting Purpose and Background',
        description: 'Urgent matter requiring board decision',
        presenter: 'John Kamau',
        duration: 10,
        isCompleted: true
      },
      {
        id: 'ag-003-02',
        order: 2,
        title: 'Partnership Proposal Presentation',
        description: 'Review partnership terms with Regional Bank',
        presenter: 'Sarah Wanjiru',
        duration: 40,
        documents: ['doc-011'],
        isCompleted: true
      },
      {
        id: 'ag-003-03',
        order: 3,
        title: 'Risk Assessment',
        description: 'Analysis of partnership risks and mitigation',
        presenter: 'Mary Akinyi',
        duration: 25,
        isCompleted: true
      },
      {
        id: 'ag-003-04',
        order: 4,
        title: 'Financial Implications',
        description: 'Budget impact and revenue projections',
        presenter: 'Grace Muthoni',
        duration: 20,
        isCompleted: true
      },
      {
        id: 'ag-003-05',
        order: 5,
        title: 'Board Discussion and Vote',
        description: 'Deliberation and decision on partnership',
        presenter: 'Sarah Wanjiru',
        duration: 25,
        isCompleted: true
      }
    ],
    attendees: ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007', 'usr-011', 'usr-014', 'usr-016'],
    documents: ['doc-011', 'doc-012'],
    createdBy: 'usr-001',
    createdDate: new Date('2024-01-10T16:00:00')
  },
  {
    id: 'mtg-004',
    title: 'Annual General Meeting 2024',
    date: new Date('2024-03-20T09:00:00'),
    time: '9:00 AM - 3:00 PM',
    location: 'Grand Ballroom, United Winners Conference Center',
    type: MeetingType.ANNUAL,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-004-01',
        order: 1,
        title: 'Registration and Welcome',
        description: 'Member registration and opening ceremony',
        presenter: 'Peter Omondi',
        duration: 30
      },
      {
        id: 'ag-004-02',
        order: 2,
        title: 'Chairperson\'s Report',
        description: 'Annual report from Board Chairperson',
        presenter: 'Sarah Wanjiru',
        duration: 45,
        documents: ['doc-013']
      },
      {
        id: 'ag-004-03',
        order: 3,
        title: 'CEO\'s Report',
        description: 'Annual performance and achievements',
        presenter: 'John Kamau',
        duration: 45,
        documents: ['doc-014']
      },
      {
        id: 'ag-004-04',
        order: 4,
        title: 'Financial Statements 2023',
        description: 'Audited financial statements presentation',
        presenter: 'Grace Muthoni',
        duration: 60,
        documents: ['doc-015']
      },
      {
        id: 'ag-004-05',
        order: 5,
        title: 'Auditor\'s Report',
        description: 'External auditor\'s findings and recommendations',
        presenter: 'James Njoroge',
        duration: 30
      },
      {
        id: 'ag-004-06',
        order: 6,
        title: 'Board Elections',
        description: 'Election of new board members',
        presenter: 'Peter Omondi',
        duration: 45
      },
      {
        id: 'ag-004-07',
        order: 7,
        title: 'Member Questions and Answers',
        description: 'Open forum for member queries',
        presenter: 'Sarah Wanjiru',
        duration: 60
      }
    ],
    attendees: ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007', 'usr-011', 'usr-014', 'usr-016'],
    documents: ['doc-013', 'doc-014', 'doc-015'],
    createdBy: 'usr-003',
    createdDate: new Date('2024-01-10T10:00:00')
  },
  {
    id: 'mtg-005',
    title: 'Audit Committee Meeting',
    date: new Date('2024-01-18T10:00:00'),
    time: '10:00 AM - 12:00 PM',
    location: 'Audit Committee Room, 4th Floor',
    type: MeetingType.SUBCOMMITTEE,
    status: MeetingStatus.IN_PROGRESS,
    agenda: [
      {
        id: 'ag-005-01',
        order: 1,
        title: 'Opening and Attendance',
        description: 'Roll call and meeting objectives',
        presenter: 'James Njoroge',
        duration: 5,
        isCompleted: true
      },
      {
        id: 'ag-005-02',
        order: 2,
        title: 'Internal Audit Report Q4 2023',
        description: 'Review of internal audit findings',
        presenter: 'Faith Nyambura',
        duration: 40,
        documents: ['doc-016'],
        isCompleted: true
      },
      {
        id: 'ag-005-03',
        order: 3,
        title: 'Compliance Status Update',
        description: 'Regulatory compliance assessment',
        presenter: 'Samuel Korir',
        duration: 30,
        isCompleted: false
      },
      {
        id: 'ag-005-04',
        order: 4,
        title: 'Risk Register Review',
        description: 'Update on identified risks and mitigation',
        presenter: 'James Njoroge',
        duration: 25,
        isCompleted: false
      },
      {
        id: 'ag-005-05',
        order: 5,
        title: 'Audit Plan 2024',
        description: 'Approval of annual audit plan',
        presenter: 'Faith Nyambura',
        duration: 20,
        isCompleted: false
      }
    ],
    attendees: ['usr-007', 'usr-012', 'usr-015'],
    documents: ['doc-016', 'doc-017'],
    createdBy: 'usr-012',
    createdDate: new Date('2024-01-10T14:00:00')
  },
  {
    id: 'mtg-006',
    title: 'Special Board Meeting - Budget Approval',
    date: new Date('2024-01-25T14:00:00'),
    time: '2:00 PM - 4:00 PM',
    location: 'Main Conference Room, 5th Floor',
    type: MeetingType.SPECIAL,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-006-01',
        order: 1,
        title: 'Meeting Commencement',
        description: 'Opening remarks and purpose',
        presenter: 'Sarah Wanjiru',
        duration: 5
      },
      {
        id: 'ag-006-02',
        order: 2,
        title: '2024 Budget Presentation',
        description: 'Comprehensive budget review',
        presenter: 'Grace Muthoni',
        duration: 45,
        documents: ['doc-018']
      },
      {
        id: 'ag-006-03',
        order: 3,
        title: 'Capital Expenditure Plans',
        description: 'Major investment proposals',
        presenter: 'David Kipchoge',
        duration: 30
      },
      {
        id: 'ag-006-04',
        order: 4,
        title: 'Revenue Projections',
        description: '2024 income forecasts and assumptions',
        presenter: 'Grace Muthoni',
        duration: 20
      },
      {
        id: 'ag-006-05',
        order: 5,
        title: 'Board Discussion and Approval',
        description: 'Final deliberation and budget approval vote',
        presenter: 'Sarah Wanjiru',
        duration: 20
      }
    ],
    attendees: ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007', 'usr-011', 'usr-014', 'usr-016'],
    documents: ['doc-018'],
    createdBy: 'usr-003',
    createdDate: new Date('2024-01-12T11:00:00')
  },
  {
    id: 'mtg-007',
    title: 'HR Committee Meeting',
    date: new Date('2024-01-22T11:00:00'),
    time: '11:00 AM - 1:00 PM',
    location: 'HR Conference Room, 2nd Floor',
    type: MeetingType.SUBCOMMITTEE,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-007-01',
        order: 1,
        title: 'Welcome and Roll Call',
        description: 'Attendance confirmation',
        presenter: 'Ruth Chebet',
        duration: 5
      },
      {
        id: 'ag-007-02',
        order: 2,
        title: 'Staff Performance Review 2023',
        description: 'Annual performance assessment summary',
        presenter: 'Ruth Chebet',
        duration: 30,
        documents: ['doc-019']
      },
      {
        id: 'ag-007-03',
        order: 3,
        title: 'Compensation and Benefits Review',
        description: 'Proposed salary adjustments and benefits',
        presenter: 'Ruth Chebet',
        duration: 25
      },
      {
        id: 'ag-007-04',
        order: 4,
        title: 'Training and Development Plan',
        description: '2024 staff development initiatives',
        presenter: 'Ruth Chebet',
        duration: 20
      },
      {
        id: 'ag-007-05',
        order: 5,
        title: 'Recruitment Needs Assessment',
        description: 'New positions and hiring plan',
        presenter: 'Ruth Chebet',
        duration: 20
      }
    ],
    attendees: ['usr-010'],
    documents: ['doc-019'],
    createdBy: 'usr-010',
    createdDate: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'mtg-008',
    title: 'Investment Committee Meeting',
    date: new Date('2024-02-05T09:00:00'),
    time: '9:00 AM - 11:00 AM',
    location: 'Investment Committee Room, 6th Floor',
    type: MeetingType.SUBCOMMITTEE,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-008-01',
        order: 1,
        title: 'Meeting Opening',
        description: 'Agenda review and attendance',
        presenter: 'Joseph Kimani',
        duration: 5
      },
      {
        id: 'ag-008-02',
        order: 2,
        title: 'Portfolio Performance Q4 2023',
        description: 'Investment portfolio returns analysis',
        presenter: 'Joseph Kimani',
        duration: 35,
        documents: ['doc-020']
      },
      {
        id: 'ag-008-03',
        order: 3,
        title: 'Market Outlook 2024',
        description: 'Economic forecast and market trends',
        presenter: 'Joseph Kimani',
        duration: 25
      },
      {
        id: 'ag-008-04',
        order: 4,
        title: 'New Investment Opportunities',
        description: 'Proposed investment allocations',
        presenter: 'Joseph Kimani',
        duration: 30
      },
      {
        id: 'ag-008-05',
        order: 5,
        title: 'Risk Assessment and Recommendations',
        description: 'Investment risk review',
        presenter: 'Joseph Kimani',
        duration: 25
      }
    ],
    attendees: ['usr-013'],
    documents: ['doc-020'],
    createdBy: 'usr-013',
    createdDate: new Date('2024-01-20T10:00:00')
  },
  {
    id: 'mtg-009',
    title: 'Q1 2024 Board Meeting',
    date: new Date('2024-03-15T10:00:00'),
    time: '10:00 AM - 2:00 PM',
    location: 'Main Conference Room, 5th Floor',
    type: MeetingType.BOARD,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-009-01',
        order: 1,
        title: 'Opening Prayer and Roll Call',
        description: 'Meeting commencement',
        presenter: 'Sarah Wanjiru',
        duration: 10
      },
      {
        id: 'ag-009-02',
        order: 2,
        title: 'Approval of Previous Minutes',
        description: 'Review special meeting minutes',
        presenter: 'Peter Omondi',
        duration: 15
      },
      {
        id: 'ag-009-03',
        order: 3,
        title: 'Q1 Financial Report',
        description: 'First quarter financial performance',
        presenter: 'Grace Muthoni',
        duration: 40
      },
      {
        id: 'ag-009-04',
        order: 4,
        title: 'Strategic Initiatives Update',
        description: 'Progress on 2024 strategic plan',
        presenter: 'Daniel Mutua',
        duration: 35
      },
      {
        id: 'ag-009-05',
        order: 5,
        title: 'Digital Transformation Project',
        description: 'IT modernization progress report',
        presenter: 'Anne Wambui',
        duration: 30
      },
      {
        id: 'ag-009-06',
        order: 6,
        title: 'Governance Framework Review',
        description: 'Updates to governance policies',
        presenter: 'Lucy Auma',
        duration: 25
      },
      {
        id: 'ag-009-07',
        order: 7,
        title: 'AOB and Closing',
        description: 'Any other business',
        presenter: 'Sarah Wanjiru',
        duration: 15
      }
    ],
    attendees: ['usr-001', 'usr-002', 'usr-003', 'usr-004', 'usr-005', 'usr-006', 'usr-007', 'usr-011', 'usr-014', 'usr-016'],
    documents: [],
    createdBy: 'usr-003',
    createdDate: new Date('2024-02-15T10:00:00')
  },
  {
    id: 'mtg-010',
    title: 'Risk Management Committee Meeting',
    date: new Date('2024-01-29T14:00:00'),
    time: '2:00 PM - 4:00 PM',
    location: 'Risk Management Office, 3rd Floor',
    type: MeetingType.SUBCOMMITTEE,
    status: MeetingStatus.SCHEDULED,
    agenda: [
      {
        id: 'ag-010-01',
        order: 1,
        title: 'Meeting Opening',
        description: 'Welcome and objectives',
        presenter: 'Mary Akinyi',
        duration: 5
      },
      {
        id: 'ag-010-02',
        order: 2,
        title: 'Risk Register Update',
        description: 'Current risk landscape overview',
        presenter: 'Mary Akinyi',
        duration: 30
      },
      {
        id: 'ag-010-03',
        order: 3,
        title: 'Cybersecurity Assessment',
        description: 'IT security risks and controls',
        presenter: 'Anne Wambui',
        duration: 25
      },
      {
        id: 'ag-010-04',
        order: 4,
        title: 'Credit Risk Analysis',
        description: 'Loan portfolio risk metrics',
        presenter: 'Elizabeth Wangari',
        duration: 25
      },
      {
        id: 'ag-010-05',
        order: 5,
        title: 'Operational Risk Review',
        description: 'Process and operational risk assessment',
        presenter: 'David Kipchoge',
        duration: 20
      },
      {
        id: 'ag-010-06',
        order: 6,
        title: 'Risk Mitigation Strategies',
        description: 'Action plans and recommendations',
        presenter: 'Mary Akinyi',
        duration: 15
      }
    ],
    attendees: ['usr-006', 'usr-014', 'usr-008'],
    documents: [],
    createdBy: 'usr-006',
    createdDate: new Date('2024-01-19T11:00:00')
  }
];

export const getMeetingById = (id: string): Meeting | undefined => {
  return mockMeetings.find(meeting => meeting.id === id);
};

export const getMeetingsByType = (type: MeetingType): Meeting[] => {
  return mockMeetings.filter(meeting => meeting.type === type);
};

export const getMeetingsByStatus = (status: MeetingStatus): Meeting[] => {
  return mockMeetings.filter(meeting => meeting.status === status);
};

export const getUpcomingMeetings = (): Meeting[] => {
  const now = new Date();
  return mockMeetings.filter(meeting => 
    meeting.date > now && meeting.status === MeetingStatus.SCHEDULED
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
};
