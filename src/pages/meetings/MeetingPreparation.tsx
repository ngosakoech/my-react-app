import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { mockMeetings } from '../../mocks/meetings.mock';
import { mockDocuments } from '../../mocks/documents.mock';
import { Meeting } from '../../types';
import { format } from 'date-fns';

export const MeetingPreparation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

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
    return <LoadingSpinner message="Loading meeting preparation..." />;
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

  const meetingDocuments = mockDocuments.filter((doc) =>
    meeting.documents.includes(doc.id)
  );

  const preparationChecklist = [
    { id: 'review-agenda', label: 'Review meeting agenda' },
    { id: 'read-documents', label: 'Read all pre-meeting documents' },
    { id: 'prepare-questions', label: 'Prepare questions or comments' },
    { id: 'check-calendar', label: 'Add meeting to calendar' },
    { id: 'test-equipment', label: 'Test audio/video equipment (if virtual)' },
  ];

  const handleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = preparationChecklist.length;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Meeting Preparation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Get ready for your upcoming meeting
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Meeting scheduled for {format(new Date(meeting.date), 'PPPp')}
      </Alert>

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Meeting Details</Typography>
                <Chip label={meeting.type} color="primary" />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{meeting.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(meeting.date), 'PPPP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meeting.time} • {meeting.location}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agenda Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {meeting.agenda.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{item.order}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={`${item.duration} min • Presenter: ${item.presenter}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pre-Meeting Documents
              </Typography>
              <Divider sx={{ my: 2 }} />
              {meetingDocuments.length > 0 ? (
                <List>
                  {meetingDocuments.map((doc) => (
                    <ListItem
                      key={doc.id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                        >
                          Download
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={doc.title}
                        secondary={
                          <>
                            {doc.category} • {(doc.size / 1024).toFixed(2)} KB
                            <br />
                            Uploaded {format(new Date(doc.uploadedDate), 'PP')}
                          </>
                        }
                      />
                      {doc.isConfidential && (
                        <Chip
                          label="Confidential"
                          size="small"
                          color="error"
                          sx={{ mr: 2 }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState
                  icon={DescriptionIcon}
                  title="No documents available"
                  description="Pre-meeting documents will be uploaded here"
                />
              )}
              {meetingDocuments.length > 0 && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 2 }}
                >
                  Download All Documents
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preparation Checklist
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {progress}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${progress}%`,
                      height: '100%',
                      bgcolor: progress === 100 ? 'success.main' : 'primary.main',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <List dense>
                {preparationChecklist.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedItems[item.id] || false}
                          onChange={() => handleCheckItem(item.id)}
                        />
                      }
                      label={item.label}
                      sx={{ width: '100%' }}
                    />
                  </ListItem>
                ))}
              </List>
              {progress === 100 && (
                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon />}>
                  You're all set for the meeting!
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/meetings/${meeting.id}`)}
                >
                  View Full Details
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export Agenda
                </Button>
                <Button variant="outlined">Add to Calendar</Button>
                <Button variant="outlined">Share with Others</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
