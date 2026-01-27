import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import type { VotingRule, Vote } from '../types/voting.types';
import { VOTING_RULE_THRESHOLDS, STATUS_COLORS } from './constants';

/**
 * Format a date using date-fns
 */
export const formatDate = (
  date: Date | string | undefined | null,
  formatString: string = 'MMM dd, yyyy'
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatString);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a date relative to now (e.g., "2 hours ago")
 */
export const formatRelativeDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (
  amount: number | undefined | null,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (amount === undefined || amount === null) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number | undefined | null): string => {
  if (bytes === undefined || bytes === null || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get user initials from full name
 */
export const getInitials = (name: string | undefined | null): string => {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/).filter(Boolean);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() || '?';
  }
  
  const first = parts[0]?.charAt(0) || '';
  const last = parts[parts.length - 1]?.charAt(0) || '';
  return (first + last).toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (
  text: string | undefined | null,
  length: number = 50,
  ellipsis: string = '...'
): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.slice(0, length - ellipsis.length) + ellipsis;
};

/**
 * Calculate voting result
 */
export const calculateVotingResult = (
  votes: Vote[],
  votingRule: VotingRule,
  totalMembers: number,
  quorum: number = 0.5
) => {
  const totalVotes = votes.length;
  const yesVotes = votes.filter((v) => v.decision === 'yes').length;
  const noVotes = votes.filter((v) => v.decision === 'no').length;
  const abstainVotes = votes.filter((v) => v.decision === 'abstain').length;

  const percentageYes = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const percentageNo = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
  const percentageAbstain = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

  const quorumMet = checkQuorum(totalVotes, totalMembers, quorum);
  const threshold = VOTING_RULE_THRESHOLDS[votingRule];
  
  let isPassed = false;
  let requiredVotes = 0;

  if (quorumMet) {
    // For QUORUM_ONLY, just need quorum
    if (votingRule === 'quorum_only') {
      isPassed = true;
      requiredVotes = Math.ceil(totalMembers * quorum);
    } else {
      // Calculate based on voting rule
      requiredVotes = Math.ceil(totalVotes * threshold);
      
      // For unanimous, check if all votes are yes (excluding abstentions)
      if (votingRule === 'unanimous') {
        isPassed = yesVotes === totalVotes - abstainVotes && noVotes === 0;
      } else {
        isPassed = yesVotes >= requiredVotes;
      }
    }
  }

  return {
    totalVotes,
    yesVotes,
    noVotes,
    abstainVotes,
    percentageYes,
    percentageNo,
    percentageAbstain,
    isPassed,
    requiredVotes,
    quorumMet,
  };
};

/**
 * Check if quorum is met
 */
export const checkQuorum = (
  votesCount: number,
  totalMembers: number,
  quorum: number = 0.5
): boolean => {
  if (totalMembers === 0) return false;
  const requiredVotes = Math.ceil(totalMembers * quorum);
  return votesCount >= requiredVotes;
};

/**
 * Get status color from STATUS_COLORS mapping
 */
export const getStatusColor = (
  status: string | undefined | null
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  if (!status) return 'default';
  
  const normalizedStatus = status.toLowerCase();
  const color = STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (color || 'default') as any;
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert snake_case or kebab-case to Title Case
 */
export const toTitleCase = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (
  value: number,
  total: number,
  decimals: number = 1
): number => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (simple validation)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Get full name from first and last name
 */
export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Check if file type is allowed
 */
export const isAllowedFileType = (fileType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(fileType);
};

/**
 * Download a file from URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sort array of objects by key
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
};

/**
 * Group array by key
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return Array.from(new Set(array));
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};
