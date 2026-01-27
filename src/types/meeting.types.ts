import { UserRole } from './auth.types';

export enum MeetingType {
  BOARD = 'BOARD',
  SUBCOMMITTEE = 'SUBCOMMITTEE',
  SPECIAL = 'SPECIAL',
  ANNUAL = 'ANNUAL'
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
  LATE = 'LATE'
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  description?: string;
  scheduledDate: Date;
  startTime: Date;
  endTime?: Date;
  location?: string;
  virtualMeetingLink?: string;
  organizerId: string;
  organizerName: string;
  agenda: AgendaItem[];
  attendees: Attendee[];
  minutes?: Minutes;
  notes?: Note[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  recordingUrl?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  order: number;
  title: string;
  description?: string;
  duration?: number;
  presenterId?: string;
  presenterName?: string;
  attachments?: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendee {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  attendanceStatus: AttendanceStatus;
  joinedAt?: Date;
  leftAt?: Date;
  responseStatus: 'ACCEPTED' | 'DECLINED' | 'TENTATIVE' | 'NO_RESPONSE';
  responseAt?: Date;
  notes?: string;
}

export interface Minutes {
  id: string;
  meetingId: string;
  content: string;
  summary?: string;
  decisions: Decision[];
  actionItems: ActionItem[];
  attendeeSummary: string;
  preparedBy: string;
  preparedById: string;
  approvedBy?: string;
  approvedById?: string;
  approvedAt?: Date;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED';
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
}

export interface Decision {
  id: string;
  minutesId: string;
  title: string;
  description: string;
  decidedAt: Date;
  relatedAgendaItemId?: string;
  outcome: string;
  votes?: {
    for: number;
    against: number;
    abstain: number;
  };
}

export interface ActionItem {
  id: string;
  minutesId: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedToNames: string[];
  dueDate?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  content: string;
  isPrivate: boolean;
  timestamp: Date;
  updatedAt?: Date;
  attachments?: string[];
  relatedAgendaItemId?: string;
}

export interface MeetingInvitation {
  id: string;
  meetingId: string;
  recipientEmail: string;
  recipientName?: string;
  message?: string;
  sentAt: Date;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface MeetingReminder {
  id: string;
  meetingId: string;
  reminderTime: Date;
  reminderType: 'EMAIL' | 'SMS' | 'PUSH';
  isSent: boolean;
  sentAt?: Date;
}
