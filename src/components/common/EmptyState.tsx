import { Box, Typography, type SvgIconProps } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ComponentType<SvgIconProps>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ 
  icon: Icon = InboxIcon, 
  title, 
  description,
  action 
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Icon
        sx={{
          fontSize: 80,
          color: 'text.disabled',
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
};
