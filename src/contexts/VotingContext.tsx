import React, { createContext, useContext, useReducer, useCallback } from 'react';
import votingService from '../services/votingService';
import type { ResolutionFilters, CreateResolutionData, CastVoteData } from '../services/votingService';
import type { Resolution, VotingResult, Vote } from '../types/voting.types';
import type { PaginatedResponse } from '../services/api';

interface VotingState {
  resolutions: Resolution[];
  selectedResolution: Resolution | null;
  votingResults: Map<string, VotingResult>;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
}

type VotingAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PaginatedResponse<Resolution> }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'SELECT_RESOLUTION'; payload: Resolution | null }
  | { type: 'CREATE_RESOLUTION'; payload: Resolution }
  | { type: 'UPDATE_RESOLUTION'; payload: Resolution }
  | { type: 'CAST_VOTE'; payload: Resolution }
  | { type: 'SET_VOTING_RESULTS'; payload: { resolutionId: string; results: VotingResult } }
  | { type: 'CLEAR_ERROR' };

interface VotingContextType extends VotingState {
  fetchResolutions: (filters?: ResolutionFilters) => Promise<void>;
  getResolution: (id: string) => Promise<void>;
  createResolution: (data: CreateResolutionData) => Promise<Resolution>;
  castVote: (resolutionId: string, voteData: CastVoteData) => Promise<Vote>;
  getResults: (resolutionId: string) => Promise<VotingResult>;
  selectResolution: (resolution: Resolution | null) => void;
  clearError: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const votingReducer = (state: VotingState, action: VotingAction): VotingState => {
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
        resolutions: action.payload.data,
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
    case 'SELECT_RESOLUTION':
      return {
        ...state,
        selectedResolution: action.payload,
      };
    case 'CREATE_RESOLUTION':
      return {
        ...state,
        resolutions: [action.payload, ...state.resolutions],
        loading: false,
        error: null,
      };
    case 'UPDATE_RESOLUTION':
      return {
        ...state,
        resolutions: state.resolutions.map(r => r.id === action.payload.id ? action.payload : r),
        selectedResolution: state.selectedResolution?.id === action.payload.id ? action.payload : state.selectedResolution,
        loading: false,
        error: null,
      };
    case 'CAST_VOTE':
      return {
        ...state,
        resolutions: state.resolutions.map(r => r.id === action.payload.id ? action.payload : r),
        selectedResolution: state.selectedResolution?.id === action.payload.id ? action.payload : state.selectedResolution,
        loading: false,
        error: null,
      };
    case 'SET_VOTING_RESULTS': {
      const newResults = new Map(state.votingResults);
      newResults.set(action.payload.resolutionId, action.payload.results);
      return {
        ...state,
        votingResults: newResults,
        loading: false,
        error: null,
      };
    }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: VotingState = {
  resolutions: [],
  selectedResolution: null,
  votingResults: new Map(),
  loading: false,
  error: null,
  pagination: null,
};

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(votingReducer, initialState);

  const fetchResolutions = useCallback(async (filters?: ResolutionFilters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await votingService.getResolutions(filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch resolutions',
      });
      throw error;
    }
  }, []);

  const getResolution = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const resolution = await votingService.getResolutionById(id);
      dispatch({ type: 'SELECT_RESOLUTION', payload: resolution });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch resolution',
      });
      throw error;
    }
  }, []);

  const createResolution = useCallback(async (data: CreateResolutionData): Promise<Resolution> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const resolution = await votingService.createResolution(data);
      dispatch({ type: 'CREATE_RESOLUTION', payload: resolution });
      return resolution;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to create resolution',
      });
      throw error;
    }
  }, []);

  const castVote = useCallback(async (resolutionId: string, voteData: CastVoteData): Promise<Vote> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const vote = await votingService.castVote(resolutionId, voteData);
      // Fetch the updated resolution after voting
      const resolution = await votingService.getResolutionById(resolutionId);
      dispatch({ type: 'CAST_VOTE', payload: resolution });
      return vote;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to cast vote',
      });
      throw error;
    }
  }, []);

  const getResults = useCallback(async (resolutionId: string): Promise<VotingResult> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const results = await votingService.getVotingResults(resolutionId);
      dispatch({
        type: 'SET_VOTING_RESULTS',
        payload: { resolutionId, results },
      });
      return results;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch voting results',
      });
      throw error;
    }
  }, []);

  const selectResolution = useCallback((resolution: Resolution | null) => {
    dispatch({ type: 'SELECT_RESOLUTION', payload: resolution });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: VotingContextType = {
    ...state,
    fetchResolutions,
    getResolution,
    createResolution,
    castVote,
    getResults,
    selectResolution,
    clearError,
  };

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>;
};

export const useVotingContext = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVotingContext must be used within a VotingProvider');
  }
  return context;
};

export default VotingContext;
