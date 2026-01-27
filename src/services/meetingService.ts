import { simulateApiDelay, createPaginatedResponse } from './api';
import type { PaginatedResponse } from './api';
import type { Meeting, AgendaItem } from '../types/meeting.types';
import { MeetingStatus, MeetingType } from '../types/meeting.types';
import { mockMeetings } from '../mocks';

export interface MeetingFilters {
  status?: MeetingStatus;
  type?: MeetingType;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateMeetingData {
  title: string;
  date: Date;
  time: string;
  location: string;
  type: MeetingType;
  agenda: Omit<AgendaItem, 'id'>[];
  attendees: string[];
  documents?: string[];
}

export interface UpdateMeetingData {
  title?: string;
  date?: Date;
  time?: string;
  location?: string;
  status?: MeetingStatus;
  agenda?: AgendaItem[];
  attendees?: string[];
  documents?: string[];
}

class MeetingService {
  // Local state for mock data
  private meetings: Meeting[] = [...mockMeetings];

  /**
   * Get all meetings with optional filters
   */
  async getMeetings(filters?: MeetingFilters): Promise<PaginatedResponse<Meeting>> {
    return simulateApiDelay(() => {
      let filteredMeetings = [...this.meetings];

      // Apply filters
      if (filters?.status) {
        filteredMeetings = filteredMeetings.filter(m => m.status === filters.status);
      }

      if (filters?.type) {
        filteredMeetings = filteredMeetings.filter(m => m.type === filters.type);
      }

      if (filters?.startDate) {
        filteredMeetings = filteredMeetings.filter(m => m.date >= filters.startDate!);
      }

      if (filters?.endDate) {
        filteredMeetings = filteredMeetings.filter(m => m.date <= filters.endDate!);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredMeetings = filteredMeetings.filter(m =>
          m.title.toLowerCase().includes(searchLower) ||
          m.location.toLowerCase().includes(searchLower)
        );
      }

      // Sort by date (most recent first)
      filteredMeetings.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Paginate
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      return createPaginatedResponse(filteredMeetings, page, pageSize);
    }, 600);
  }

  /**
   * Get a single meeting by ID
   */
  async getMeetingById(id: string): Promise<Meeting> {
    return simulateApiDelay(() => {
      const meeting = this.meetings.find(m => m.id === id);

      if (!meeting) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      return meeting;
    }, 400);
  }

  /**
   * Create a new meeting
   */
  async createMeeting(data: CreateMeetingData): Promise<Meeting> {
    return simulateApiDelay(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Generate agenda items with IDs
      const agendaWithIds: AgendaItem[] = data.agenda.map((item, index) => ({
        ...item,
        id: `ag-${Date.now()}-${index}`,
      }));

      const newMeeting: Meeting = {
        id: `mtg-${Date.now()}`,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type,
        status: MeetingStatus.SCHEDULED,
        agenda: agendaWithIds,
        attendees: data.attendees,
        documents: data.documents || [],
        createdBy: currentUser.id || 'usr-001',
        createdDate: new Date(),
      };

      this.meetings.push(newMeeting);

      return newMeeting;
    }, 800);
  }

  /**
   * Update an existing meeting
   */
  async updateMeeting(id: string, data: UpdateMeetingData): Promise<Meeting> {
    return simulateApiDelay(() => {
      const meetingIndex = this.meetings.findIndex(m => m.id === id);

      if (meetingIndex === -1) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const meeting = this.meetings[meetingIndex]!;

      // Check if meeting can be updated
      if (meeting.status === MeetingStatus.COMPLETED) {
        throw {
          message: 'Cannot update a completed meeting',
          code: 'MEETING_COMPLETED',
          status: 400,
        };
      }

      if (meeting.status === MeetingStatus.CANCELLED) {
        throw {
          message: 'Cannot update a cancelled meeting',
          code: 'MEETING_CANCELLED',
          status: 400,
        };
      }

      // Update meeting - preserve required fields
      const updatedMeeting: Meeting = {
        id: meeting.id,
        title: data.title ?? meeting.title,
        date: data.date ?? meeting.date,
        time: data.time ?? meeting.time,
        location: data.location ?? meeting.location,
        type: meeting.type,
        status: data.status ?? meeting.status,
        agenda: data.agenda ?? meeting.agenda,
        attendees: data.attendees ?? meeting.attendees,
        documents: data.documents ?? meeting.documents,
        minutes: meeting.minutes,
        notes: meeting.notes,
        createdBy: meeting.createdBy,
        createdDate: meeting.createdDate,
        modifiedBy: currentUser.id || 'usr-001',
        modifiedDate: new Date(),
      };

      this.meetings[meetingIndex] = updatedMeeting;

      return updatedMeeting;
    }, 700);
  }

  /**
   * Delete a meeting
   */
  async deleteMeeting(id: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(() => {
      const meetingIndex = this.meetings.findIndex(m => m.id === id);

      if (meetingIndex === -1) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const meeting = this.meetings[meetingIndex]!;

      // Check if meeting can be deleted
      if (meeting.status === MeetingStatus.IN_PROGRESS) {
        throw {
          message: 'Cannot delete a meeting in progress',
          code: 'MEETING_IN_PROGRESS',
          status: 400,
        };
      }

      if (meeting.status === MeetingStatus.COMPLETED) {
        throw {
          message: 'Cannot delete a completed meeting. Consider cancelling instead.',
          code: 'MEETING_COMPLETED',
          status: 400,
        };
      }

      this.meetings.splice(meetingIndex, 1);

      return {
        success: true,
        message: 'Meeting deleted successfully',
      };
    }, 500);
  }

  /**
   * Get meeting agenda
   */
  async getMeetingAgenda(id: string): Promise<AgendaItem[]> {
    return simulateApiDelay(() => {
      const meeting = this.meetings.find(m => m.id === id);

      if (!meeting) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      return meeting.agenda.sort((a, b) => a.order - b.order);
    }, 300);
  }

  /**
   * Update a specific agenda item
   */
  async updateAgendaItem(
    meetingId: string,
    itemId: string,
    data: Partial<AgendaItem>
  ): Promise<AgendaItem> {
    return simulateApiDelay(() => {
      const meeting = this.meetings.find(m => m.id === meetingId);

      if (!meeting) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const itemIndex = meeting.agenda.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        throw {
          message: 'Agenda item not found',
          code: 'AGENDA_ITEM_NOT_FOUND',
          status: 404,
        };
      }

      const item = meeting.agenda[itemIndex]!;

      // Update agenda item - preserve required fields
      const updatedItem: AgendaItem = {
        id: item.id,
        order: data.order ?? item.order,
        title: data.title ?? item.title,
        description: data.description ?? item.description,
        presenter: data.presenter ?? item.presenter,
        duration: data.duration ?? item.duration,
        documents: data.documents ?? item.documents,
        notes: data.notes ?? item.notes,
        isCompleted: data.isCompleted ?? item.isCompleted,
      };

      meeting.agenda[itemIndex] = updatedItem;

      // Update meeting modified date
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      meeting.modifiedBy = currentUser.id || 'usr-001';
      meeting.modifiedDate = new Date();

      return updatedItem;
    }, 500);
  }

  /**
   * Add an agenda item to a meeting
   */
  async addAgendaItem(meetingId: string, item: Omit<AgendaItem, 'id'>): Promise<AgendaItem> {
    return simulateApiDelay(() => {
      const meeting = this.meetings.find(m => m.id === meetingId);

      if (!meeting) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const newItem: AgendaItem = {
        ...item,
        id: `ag-${meetingId}-${Date.now()}`,
      };

      meeting.agenda.push(newItem);

      // Update meeting modified date
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      meeting.modifiedBy = currentUser.id || 'usr-001';
      meeting.modifiedDate = new Date();

      return newItem;
    }, 500);
  }

  /**
   * Remove an agenda item from a meeting
   */
  async removeAgendaItem(meetingId: string, itemId: string): Promise<{ success: boolean; message: string }> {
    return simulateApiDelay(() => {
      const meeting = this.meetings.find(m => m.id === meetingId);

      if (!meeting) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const itemIndex = meeting.agenda.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        throw {
          message: 'Agenda item not found',
          code: 'AGENDA_ITEM_NOT_FOUND',
          status: 404,
        };
      }

      meeting.agenda.splice(itemIndex, 1);

      // Update meeting modified date
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      meeting.modifiedBy = currentUser.id || 'usr-001';
      meeting.modifiedDate = new Date();

      return {
        success: true,
        message: 'Agenda item removed successfully',
      };
    }, 500);
  }

  /**
   * Get upcoming meetings
   */
  async getUpcomingMeetings(limit: number = 5): Promise<Meeting[]> {
    return simulateApiDelay(() => {
      const now = new Date();
      return this.meetings
        .filter(m => m.date >= now && m.status === MeetingStatus.SCHEDULED)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, limit);
    }, 400);
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(id: string, _reason?: string): Promise<Meeting> {
    return simulateApiDelay(() => {
      const meetingIndex = this.meetings.findIndex(m => m.id === id);

      if (meetingIndex === -1) {
        throw {
          message: 'Meeting not found',
          code: 'MEETING_NOT_FOUND',
          status: 404,
        };
      }

      const meeting = this.meetings[meetingIndex]!;

      if (meeting.status === MeetingStatus.COMPLETED) {
        throw {
          message: 'Cannot cancel a completed meeting',
          code: 'MEETING_COMPLETED',
          status: 400,
        };
      }

      if (meeting.status === MeetingStatus.CANCELLED) {
        throw {
          message: 'Meeting is already cancelled',
          code: 'MEETING_ALREADY_CANCELLED',
          status: 400,
        };
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const updatedMeeting: Meeting = {
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        type: meeting.type,
        status: MeetingStatus.CANCELLED,
        agenda: meeting.agenda,
        attendees: meeting.attendees,
        documents: meeting.documents,
        minutes: meeting.minutes,
        notes: meeting.notes,
        createdBy: meeting.createdBy,
        createdDate: meeting.createdDate,
        modifiedBy: currentUser.id || 'usr-001',
        modifiedDate: new Date(),
      };

      this.meetings[meetingIndex] = updatedMeeting;

      return updatedMeeting;
    }, 600);
  }
}

export default new MeetingService();
