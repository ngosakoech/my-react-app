export const MeetingType = {
  BOARD: 'board',
  SUBCOMMITTEE: 'subcommittee',
  EMERGENCY: 'emergency',
  ANNUAL: 'annual',
  SPECIAL: 'special'
} as const;

export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export const MeetingStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description: string;
  presenter: string;
  duration: number;
  documents?: string[];
  notes?: string;
  isCompleted?: boolean;
}

export interface Minutes {
  id: string;
  meetingId: string;
  content: string;
  preparedBy: string;
  preparedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  isApproved: boolean;
  attachments?: string[];
}

export interface Note {
  id: string;
  meetingId: string;
  agendaItemId?: string;
  content: string;
  createdBy: string;
  createdDate: Date;
  isPrivate: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: MeetingType;
  status: MeetingStatus;
  agenda: AgendaItem[];
  attendees: string[];
  documents: string[];
  minutes?: Minutes;
  notes?: Note[];
  createdBy: string;
  createdDate: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
}
