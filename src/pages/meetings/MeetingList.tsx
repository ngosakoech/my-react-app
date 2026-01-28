import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  Fab,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useMeetingContext } from '../../contexts/MeetingContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Meeting } from '../../types/meeting.types';
import { MeetingType, MeetingStatus } from '../../types/meeting.types';
import { format } from 'date-fns';

const meetingTypeLabels: Record<string, string> = {
  [MeetingType.BOARD]: 'Board Meeting',
  [MeetingType.SUBCOMMITTEE]: 'Subcommittee',
  [MeetingType.EMERGENCY]: 'Emergency',
  [MeetingType.ANNUAL]: 'Annual',
  [MeetingType.SPECIAL]: 'Special'
};

const meetingStatusLabels: Record<string, string> = {
  [MeetingStatus.SCHEDULED]: 'Scheduled',
  [MeetingStatus.IN_PROGRESS]: 'In Progress',
  [MeetingStatus.COMPLETED]: 'Completed',
  [MeetingStatus.CANCELLED]: 'Cancelled'
};

export const MeetingList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { meetings, loading, error, fetchMeetings, deleteMeeting, clearError } = useMeetingContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(9);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'board_member';

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, meeting: Meeting) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMeeting(meeting);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMeeting(null);
  };

  const handleView = () => {
    if (selectedMeeting) {
      navigate(`/meetings/${selectedMeeting.id}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedMeeting) {
      navigate(`/meetings/edit/${selectedMeeting.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedMeeting) {
      try {
        await deleteMeeting(selectedMeeting.id);
        setDeleteDialogOpen(false);
        setSelectedMeeting(null);
      } catch (err) {
        console.error('Failed to delete meeting:', err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedMeeting(null);
  };

  const filteredAndSortedMeetings = useMemo(() => {
    let filtered = meetings.filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           meeting.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
      const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [meetings, searchQuery, statusFilter, typeFilter, sortBy]);

  const paginatedMeetings = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAndSortedMeetings.slice(start, end);
  }, [filteredAndSortedMeetings, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedMeetings.length / rowsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return 'info';
      case MeetingStatus.IN_PROGRESS:
        return 'warning';
      case MeetingStatus.COMPLETED:
        return 'success';
      case MeetingStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && meetings.length === 0) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Meetings
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/meetings/new')}
            >
              Create Meeting
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
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
              </Box>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                {Object.entries(meetingStatusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {Object.entries(meetingTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </TextField>
            </Box>
          </CardContent>
        </Card>

        {paginatedMeetings.length === 0 ? (
          <EmptyState
            title="No meetings found"
            description={
              searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? "Try adjusting your filters"
                : "Get started by creating your first meeting"
            }
            action={
              isAdmin && !searchQuery && statusFilter === 'all' && typeFilter === 'all' ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/meetings/new')}
                >
                  Create Meeting
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {paginatedMeetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/meetings/${meeting.id}`)}
                >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Chip
                          label={meetingTypeLabels[meeting.type]}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, meeting)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {meeting.title}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(meeting.date), 'MMM dd, yyyy')} at {meeting.time}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {meeting.location}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {meeting.attendees.length} attendees
                        </Typography>
                      </Box>

                      <StatusBadge
                        status={getStatusColor(meeting.status)}
                        label={meetingStatusLabels[meeting.status]}
                      />
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/meetings/${meeting.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Box display="flex" gap={1}>
                  <Button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Box display="flex" alignItems="center" px={2}>
                    <Typography>
                      Page {page + 1} of {totalPages}
                    </Typography>
                  </Box>
                  <Button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => navigate('/meetings/new')}
        >
          <AddIcon />
        </Fab>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {isAdmin && (
          <>
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Meeting"
        message={`Are you sure you want to delete "${selectedMeeting?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </AppLayout>
  );
};
