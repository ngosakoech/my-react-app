import React, { createContext, useContext, useReducer, useCallback } from 'react';
import meetingService from '../services/meetingService';
import type { MeetingFilters, CreateMeetingData, UpdateMeetingData } from '../services/meetingService';
import type { Meeting } from '../types/meeting.types';
import type { PaginatedResponse } from '../services/api';

interface MeetingState {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
}

type MeetingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PaginatedResponse<Meeting> }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'SELECT_MEETING'; payload: Meeting | null }
  | { type: 'CREATE_MEETING'; payload: Meeting }
  | { type: 'UPDATE_MEETING'; payload: Meeting }
  | { type: 'DELETE_MEETING'; payload: string }
  | { type: 'CLEAR_ERROR' };

interface MeetingContextType extends MeetingState {
  fetchMeetings: (filters?: MeetingFilters) => Promise<void>;
  getMeeting: (id: string) => Promise<void>;
  createMeeting: (data: CreateMeetingData) => Promise<Meeting>;
  updateMeeting: (id: string, data: UpdateMeetingData) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
  selectMeeting: (meeting: Meeting | null) => void;
  clearError: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

const meetingReducer = (state: MeetingState, action: MeetingAction): MeetingState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        meetings: action.payload.data,
        pagination: {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
        },
        loading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SELECT_MEETING':
      return {
        ...state,
        selectedMeeting: action.payload,
      };
    case 'CREATE_MEETING':
      return {
        ...state,
        meetings: [action.payload, ...state.meetings],
        loading: false,
        error: null,
      };
    case 'UPDATE_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(m => m.id === action.payload.id ? action.payload : m),
        selectedMeeting: state.selectedMeeting?.id === action.payload.id ? action.payload : state.selectedMeeting,
        loading: false,
        error: null,
      };
    case 'DELETE_MEETING':
      return {
        ...state,
        meetings: state.meetings.filter(m => m.id !== action.payload),
        selectedMeeting: state.selectedMeeting?.id === action.payload ? null : state.selectedMeeting,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: MeetingState = {
  meetings: [],
  selectedMeeting: null,
  loading: false,
  error: null,
  pagination: null,
};

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(meetingReducer, initialState);

  const fetchMeetings = useCallback(async (filters?: MeetingFilters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await meetingService.getMeetings(filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch meetings',
      });
      throw error;
    }
  }, []);

  const getMeeting = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const meeting = await meetingService.getMeetingById(id);
      dispatch({ type: 'SELECT_MEETING', payload: meeting });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch meeting',
      });
      throw error;
    }
  }, []);

  const createMeeting = useCallback(async (data: CreateMeetingData): Promise<Meeting> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const meeting = await meetingService.createMeeting(data);
      dispatch({ type: 'CREATE_MEETING', payload: meeting });
      return meeting;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to create meeting',
      });
      throw error;
    }
  }, []);

  const updateMeeting = useCallback(async (id: string, data: UpdateMeetingData): Promise<Meeting> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const meeting = await meetingService.updateMeeting(id, data);
      dispatch({ type: 'UPDATE_MEETING', payload: meeting });
      return meeting;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to update meeting',
      });
      throw error;
    }
  }, []);

  const deleteMeeting = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await meetingService.deleteMeeting(id);
      dispatch({ type: 'DELETE_MEETING', payload: id });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to delete meeting',
      });
      throw error;
    }
  }, []);

  const selectMeeting = useCallback((meeting: Meeting | null) => {
    dispatch({ type: 'SELECT_MEETING', payload: meeting });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: MeetingContextType = {
    ...state,
    fetchMeetings,
    getMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    selectMeeting,
    clearError,
  };

  return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>;
};

export const useMeetingContext = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeetingContext must be used within a MeetingProvider');
  }
  return context;
};

export default MeetingContext;
