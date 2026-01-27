import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  HowToVote as VoteIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { mockMeetings } from '../../mocks/meetings.mock';
import { mockDocuments } from '../../mocks/documents.mock';
import { mockResolutions } from '../../mocks/resolutions.mock';
import { MeetingStatus, ResolutionStatus } from '../../types';
import { format, isAfter, addDays } from 'date-fns';

export const BoardMemberDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const upcomingMeetings = mockMeetings
    .filter(
      (m) =>
        m.status === MeetingStatus.SCHEDULED &&
        isAfter(new Date(m.date), new Date())
    )
    .slice(0, 3);

  const recentDocuments = mockDocuments.slice(0, 5);

  const activeVoting = mockResolutions
    .filter(
      (r) =>
        r.status === ResolutionStatus.ACTIVE &&
        isAfter(new Date(r.votingDeadline), new Date())
    )
    .slice(0, 3);

  const pendingTasks = [
    {
      id: 1,
      title: 'Review Q4 Financial Report',
      deadline: addDays(new Date(), 2),
      priority: 'high',
    },
    {
      id: 2,
      title: 'Approve Meeting Minutes',
      deadline: addDays(new Date(), 5),
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Submit Committee Recommendations',
      deadline: addDays(new Date(), 7),
      priority: 'low',
    },
  ];

  const metrics = [
    {
      label: 'Meetings Attended',
      value: '12/14',
      icon: <EventIcon />,
      color: '#1976d2',
    },
    {
      label: 'Documents Reviewed',
      value: '45',
      icon: <DescriptionIcon />,
      color: '#9c27b0',
    },
    {
      label: 'Resolutions Voted',
      value: '18/20',
      icon: <VoteIcon />,
      color: '#2e7d32',
    },
    {
      label: 'Participation Rate',
      value: '95%',
      icon: <TrendingUpIcon />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your board activities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: metric.color, width: 48, height: 48 }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {metric.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Meetings
              </Typography>
              {upcomingMeetings.length > 0 ? (
                <List>
                  {upcomingMeetings.map((meeting) => (
                    <ListItem key={meeting.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={meeting.title}
                        secondary={
                          <>
                            {format(new Date(meeting.date), 'PPP')} at {meeting.time}
                            <br />
                            {meeting.location}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No upcoming meetings
                </Typography>
              )}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Tasks
              </Typography>
              <List>
                {pendingTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            task.priority === 'high'
                              ? 'error.main'
                              : task.priority === 'medium'
                              ? 'warning.main'
                              : 'info.main',
                        }}
                      >
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <AccessTimeIcon fontSize="small" />
                          Due: {format(task.deadline, 'PPP')}
                        </Box>
                      }
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={
                        task.priority === 'high'
                          ? 'error'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'info'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Voting
              </Typography>
              {activeVoting.length > 0 ? (
                <List>
                  {activeVoting.map((resolution) => (
                    <ListItem key={resolution.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <VoteIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={resolution.title}
                        secondary={`Deadline: ${format(
                          new Date(resolution.votingDeadline),
                          'PPpp'
                        )}`}
                      />
                      <Button variant="contained" size="small">
                        Vote
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No active voting resolutions
                </Typography>
              )}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Resolutions
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Documents
              </Typography>
              <List>
                {recentDocuments.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doc.title}
                      secondary={`${doc.category} • ${format(
                        new Date(doc.uploadedDate),
                        'PP'
                      )}`}
                    />
                    <Button size="small">View</Button>
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                Browse Library
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
