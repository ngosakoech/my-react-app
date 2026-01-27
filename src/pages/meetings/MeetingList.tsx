import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockMeetings } from '../../mocks/meetings.mock';
import type { Meeting } from '../../types';
import { MeetingType, MeetingStatus } from '../../types';
import { format } from 'date-fns';

export const MeetingList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadMeetings = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMeetings(mockMeetings);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns: Column<Meeting>[] = [
    {
      id: 'title',
      label: 'Meeting Title',
      minWidth: 250,
      format: (_, row) => (
        <Box>
          <Typography variant="subtitle2">{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.location}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'date',
      label: 'Date & Time',
      minWidth: 150,
      format: (value) => (
        <Box>
          <Typography variant="body2">
            {format(new Date(value as Date), 'PPP')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {(value as any).time || 'TBD'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={
            value === MeetingType.BOARD
              ? 'primary'
              : value === MeetingType.EMERGENCY
              ? 'error'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value) => <StatusBadge status={value as MeetingStatus} />,
    },
    {
      id: 'attendees',
      label: 'Attendees',
      align: 'center',
      format: (value) => `${(value as string[]).length} members`,
    },
    {
      id: 'agenda',
      label: 'Agenda Items',
      align: 'center',
      format: (_, row) => row.agenda.length,
    },
  ];

  const stats = [
    {
      label: 'Total Meetings',
      value: meetings.length,
      color: 'primary.main',
    },
    {
      label: 'Upcoming',
      value: meetings.filter((m) => m.status === MeetingStatus.SCHEDULED).length,
      color: 'info.main',
    },
    {
      label: 'In Progress',
      value: meetings.filter((m) => m.status === MeetingStatus.IN_PROGRESS).length,
      color: 'warning.main',
    },
    {
      label: 'Completed',
      value: meetings.filter((m) => m.status === MeetingStatus.COMPLETED).length,
      color: 'success.main',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading meetings..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Meetings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view all board meetings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/meetings/create')}
        >
          Schedule Meeting
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {Object.values(MeetingType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.values(MeetingStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredMeetings.length === 0 ? (
        <EmptyState
          icon={EventIcon}
          title="No meetings found"
          description="Try adjusting your filters or create a new meeting"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/meetings/create')}
            >
              Schedule Meeting
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredMeetings}
          rowKey="id"
          onRowClick={(meeting) => navigate(`/meetings/${meeting.id}`)}
        />
      )}
    </Box>
  );
};
