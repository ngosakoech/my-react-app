import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  PlayArrow as StartIcon,
  VideoCall as JoinIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useMeetingContext } from '../../contexts/MeetingContext';
import { useAuth } from '../../contexts/AuthContext';
import { MeetingStatus, MeetingType } from '../../types/meeting.types';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

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

export const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedMeeting, loading, error, getMeeting } = useMeetingContext();
  
  const [activeTab, setActiveTab] = useState(0);

  const isAdmin = user?.role === 'admin' || user?.role === 'board_member';

  useEffect(() => {
    if (id) {
      getMeeting(id);
    }
  }, [id, getMeeting]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/meetings/edit/${id}`);
    }
  };

  const handleStartMeeting = () => {
    console.log('Start meeting:', id);
  };

  const handleJoinMeeting = () => {
    console.log('Join meeting:', id);
  };

  const handleDownloadMinutes = () => {
    console.log('Download minutes for meeting:', id);
  };

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

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  if (error || !selectedMeeting) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Meeting not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/meetings')}>
          Back to Meetings
        </Button>
      </AppLayout>
    );
  }

  const meeting = selectedMeeting;

  return (
    <AppLayout>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/meetings')}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Meetings
          </Link>
          <Typography color="text.primary">{meeting.title}</Typography>
        </Breadcrumbs>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {meeting.title}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Chip
                label={meetingTypeLabels[meeting.type]}
                size="small"
                color="primary"
                variant="outlined"
              />
              <StatusBadge
                status={getStatusColor(meeting.status)}
                label={meetingStatusLabels[meeting.status]}
              />
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            {meeting.status === MeetingStatus.IN_PROGRESS && (
              <Button
                variant="contained"
                color="success"
                startIcon={<JoinIcon />}
                onClick={handleJoinMeeting}
              >
                Join Meeting
              </Button>
            )}
            {meeting.status === MeetingStatus.SCHEDULED && isAdmin && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<StartIcon />}
                onClick={handleStartMeeting}
              >
                Start Meeting
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
            <IconButton onClick={() => navigate('/meetings')}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Overview" />
            <Tab label={`Agenda (${meeting.agenda.length})`} />
            <Tab label={`Documents (${meeting.documents.length})`} />
            <Tab label="Minutes" />
            <Tab label={`Attendees (${meeting.attendees.length})`} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Meeting Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(meeting.date), 'MMMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <TimeIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1">{meeting.time}</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2} sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">{meeting.location}</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" gap={1} sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                      <PersonIcon color="action" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Created By
                        </Typography>
                        <Typography variant="body1">{meeting.createdBy}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(meeting.createdDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Agenda Items
                    </Typography>
                    <Typography variant="h4">{meeting.agenda.length}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Attendees
                    </Typography>
                    <Typography variant="h4">{meeting.attendees.length}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Documents
                    </Typography>
                    <Typography variant="h4">{meeting.documents.length}</Typography>
                  </Box>

                  {meeting.minutes && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Minutes Status
                      </Typography>
                      <StatusBadge
                        status={meeting.minutes.isApproved ? 'approved' : 'pending'}
                        label={meeting.minutes.isApproved ? 'Approved' : 'Pending'}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Agenda Items
            </Typography>
            {meeting.agenda.length === 0 ? (
              <Alert severity="info">No agenda items have been added yet.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px">#</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Presenter</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Documents</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meeting.agenda.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={500}>
                            {item.title}
                          </Typography>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{item.presenter}</TableCell>
                        <TableCell>{item.duration} min</TableCell>
                        <TableCell>
                          {item.documents && item.documents.length > 0 ? (
                            <Chip
                              size="small"
                              label={`${item.documents.length} docs`}
                              variant="outlined"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {item.isCompleted ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <Checkbox disabled />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {meeting.documents.length === 0 ? (
              <Alert severity="info">No documents have been attached.</Alert>
            ) : (
              <List>
                {meeting.documents.map((doc, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="download">
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doc}
                      secondary={`Added on ${format(new Date(meeting.createdDate), 'MMM dd, yyyy')}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Meeting Minutes
              </Typography>
              {meeting.minutes && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadMinutes}
                >
                  Download
                </Button>
              )}
            </Box>

            {!meeting.minutes ? (
              <Alert severity="info">
                Minutes have not been prepared for this meeting yet.
              </Alert>
            ) : (
              <Card>
                <CardContent>
                  <Box mb={2} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Prepared By
                      </Typography>
                      <Typography variant="body1">{meeting.minutes.preparedBy}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(meeting.minutes.preparedDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    {meeting.minutes.isApproved && meeting.minutes.approvedBy && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Approved By
                        </Typography>
                        <Typography variant="body1">{meeting.minutes.approvedBy}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {meeting.minutes.approvedDate && format(new Date(meeting.minutes.approvedDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="body1" whiteSpace="pre-wrap">
                      {meeting.minutes.content}
                    </Typography>
                  </Box>

                  {meeting.minutes.attachments && meeting.minutes.attachments.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Attachments
                      </Typography>
                      <List dense>
                        {meeting.minutes.attachments.map((attachment, index) => (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <DescriptionIcon fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={attachment} />
                            <IconButton size="small">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Typography variant="h6" gutterBottom>
              Attendees
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {meeting.attendees.map((attendee, index) => (
                <Card variant="outlined" key={index}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 48, height: 48 }}>
                        {attendee.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {attendee}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Board Member
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </AppLayout>
  );
};
