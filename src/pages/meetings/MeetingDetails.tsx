import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Notes as NotesIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { mockMeetings } from '../../mocks/meetings.mock';
import { mockUsers } from '../../mocks/users.mock';
import { mockDocuments } from '../../mocks/documents.mock';
import { type Meeting } from '../../types';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadMeeting = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const foundMeeting = mockMeetings.find((m) => m.id === id);
        setMeeting(foundMeeting || null);
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading meeting details..." />;
  }

  if (!meeting) {
    return (
      <EmptyState
        title="Meeting not found"
        description="The meeting you're looking for doesn't exist"
        action={
          <Button variant="contained" onClick={() => navigate('/meetings')}>
            Back to Meetings
          </Button>
        }
      />
    );
  }

  const attendeeUsers = mockUsers.filter((user) =>
    meeting.attendees.includes(user.id)
  );

  const meetingDocuments = mockDocuments.filter((doc) =>
    meeting.documents.includes(doc.id)
  );

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/meetings')}
          sx={{ cursor: 'pointer' }}
        >
          Meetings
        </Link>
        <Typography color="text.primary">{meeting.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/meetings')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {meeting.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <StatusBadge status={meeting.status} />
            <Chip label={meeting.type} size="small" />
          </Box>
        </Box>
        <Button startIcon={<EditIcon />} variant="outlined">
          Edit
        </Button>
        <Button startIcon={<DeleteIcon />} variant="outlined" color="error">
          Cancel
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Agenda" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="Attendees" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Documents" icon={<DescriptionIcon />} iconPosition="start" />
              <Tab label="Minutes" icon={<NotesIcon />} iconPosition="start" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <CardContent>
                {meeting.agenda.length > 0 ? (
                  <List>
                    {meeting.agenda.map((item, index) => (
                      <Box key={item.id}>
                        {index > 0 && <Divider sx={{ my: 2 }} />}
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {item.order}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {item.title}
                                </Typography>
                                {item.isCompleted && (
                                  <Chip label="Completed" size="small" color="success" />
                                )}
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {item.description}
                                </Typography>
                                <Typography variant="caption">
                                  Presenter: {item.presenter} • Duration: {item.duration} minutes
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    icon={AssignmentIcon}
                    title="No agenda items"
                    description="Agenda items will appear here"
                  />
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <CardContent>
                {attendeeUsers.length > 0 ? (
                  <List>
                    {attendeeUsers.map((user) => (
                      <ListItem key={user.id}>
                        <ListItemAvatar>
                          <Avatar src={user.avatar}>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.firstName} ${user.lastName}`}
                          secondary={`${user.role} • ${user.email}`}
                        />
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={user.isActive ? 'success' : 'default'}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    icon={PersonIcon}
                    title="No attendees"
                    description="Attendees will be listed here"
                  />
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <CardContent>
                {meetingDocuments.length > 0 ? (
                  <List>
                    {meetingDocuments.map((doc) => (
                      <ListItem
                        key={doc.id}
                        secondaryAction={
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            <DescriptionIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={doc.title}
                          secondary={`${doc.type} • ${(doc.size / 1024).toFixed(2)} KB`}
                        />
                        <Chip label={doc.category} size="small" sx={{ mr: 2 }} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    icon={DescriptionIcon}
                    title="No documents"
                    description="Meeting documents will appear here"
                  />
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <CardContent>
                {meeting.minutes ? (
                  <Box>
                    <Typography variant="body1" paragraph>
                      {meeting.minutes.content}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        Prepared by: {meeting.minutes.preparedBy}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(meeting.minutes.preparedDate), 'PPP')}
                      </Typography>
                    </Box>
                    {meeting.minutes.isApproved && (
                      <Chip
                        label="Approved"
                        color="success"
                        size="small"
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Box>
                ) : (
                  <EmptyState
                    icon={NotesIcon}
                    title="No minutes available"
                    description="Meeting minutes will be added after the meeting"
                  />
                )}
              </CardContent>
            </TabPanel>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meeting Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(meeting.date), 'PPPp')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meeting.time}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">{meeting.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body2">{meeting.createdBy}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(meeting.createdDate), 'PPP')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  fullWidth
                >
                  Download Agenda
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                >
                  Add Document
                </Button>
                <Button variant="outlined" startIcon={<NotesIcon />} fullWidth>
                  Add Notes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
