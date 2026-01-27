import React, { createContext, useContext, useReducer, useCallback } from 'react';
import documentService from '../services/documentService';
import type { DocumentFilters, UploadDocumentData, UpdateDocumentData } from '../services/documentService';
import type { Document } from '../types/document.types';
import type { PaginatedResponse } from '../services/api';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
  searchQuery: string;
  filters: DocumentFilters;
}

type DocumentAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: PaginatedResponse<Document> }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'SELECT_DOCUMENT'; payload: Document | null }
  | { type: 'UPLOAD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: DocumentFilters }
  | { type: 'CLEAR_ERROR' };

interface DocumentContextType extends DocumentState {
  fetchDocuments: (filters?: DocumentFilters) => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  uploadDocument: (data: UploadDocumentData) => Promise<Document>;
  updateDocument: (id: string, data: UpdateDocumentData) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  selectDocument: (document: Document | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: DocumentFilters) => void;
  clearError: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
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
        documents: action.payload.data,
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
    case 'SELECT_DOCUMENT':
      return {
        ...state,
        selectedDocument: action.payload,
      };
    case 'UPLOAD_DOCUMENT':
      return {
        ...state,
        documents: [action.payload, ...state.documents],
        loading: false,
        error: null,
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(d => d.id === action.payload.id ? action.payload : d),
        selectedDocument: state.selectedDocument?.id === action.payload.id ? action.payload : state.selectedDocument,
        loading: false,
        error: null,
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(d => d.id !== action.payload),
        selectedDocument: state.selectedDocument?.id === action.payload ? null : state.selectedDocument,
        loading: false,
        error: null,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
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

const initialState: DocumentState = {
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
  pagination: null,
  searchQuery: '',
  filters: {},
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const fetchDocuments = useCallback(async (additionalFilters?: DocumentFilters) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Merge with provided filters - caller is responsible for including search/filters if needed
      const response = await documentService.getDocuments(additionalFilters);
      dispatch({ type: 'FETCH_SUCCESS', payload: response });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch documents',
      });
      throw error;
    }
  }, []);

  const getDocument = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const document = await documentService.getDocumentById(id);
      dispatch({ type: 'SELECT_DOCUMENT', payload: document });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to fetch document',
      });
      throw error;
    }
  }, []);

  const uploadDocument = useCallback(async (data: UploadDocumentData): Promise<Document> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const document = await documentService.uploadDocument(data);
      dispatch({ type: 'UPLOAD_DOCUMENT', payload: document });
      return document;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to upload document',
      });
      throw error;
    }
  }, []);

  const updateDocument = useCallback(async (id: string, data: UpdateDocumentData): Promise<Document> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const document = await documentService.updateDocument(id, data);
      dispatch({ type: 'UPDATE_DOCUMENT', payload: document });
      return document;
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to update document',
      });
      throw error;
    }
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await documentService.deleteDocument(id);
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (error: any) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.message || 'Failed to delete document',
      });
      throw error;
    }
  }, []);

  const selectDocument = useCallback((document: Document | null) => {
    dispatch({ type: 'SELECT_DOCUMENT', payload: document });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setFilters = useCallback((filters: DocumentFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: DocumentContextType = {
    ...state,
    fetchDocuments,
    getDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
    setSearchQuery,
    setFilters,
    clearError,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useDocumentContext = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;
