import { Chip } from '@mui/material';

export type StatusType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'default'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'cancelled';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'small' | 'medium';
}

const statusConfig: Record<string, { color: 'success' | 'error' | 'warning' | 'info' | 'default'; label?: string }> = {
  success: { color: 'success' },
  error: { color: 'error' },
  warning: { color: 'warning' },
  info: { color: 'info' },
  default: { color: 'default' },
  pending: { color: 'warning', label: 'Pending' },
  approved: { color: 'success', label: 'Approved' },
  rejected: { color: 'error', label: 'Rejected' },
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
};

export const StatusBadge = ({ status, label, size = 'small' }: StatusBadgeProps) => {
  const config = statusConfig[status.toLowerCase()] || { color: 'default' as const };
  const displayLabel = label || config.label || status;

  return (
    <Chip
      label={displayLabel}
      color={config.color}
      size={size}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
};
