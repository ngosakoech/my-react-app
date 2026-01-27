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
  People as PeopleIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { mockMeetings } from '../../mocks/meetings.mock';
import { mockUsers } from '../../mocks/users.mock';
import { mockLoans } from '../../mocks/loans.mock';
import { MeetingStatus, LoanStatus } from '../../types';
import { format } from 'date-fns';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const activeUsers = mockUsers.filter(u => u.isActive).length;
        const upcomingMeetings = mockMeetings.filter(
          m => m.status === MeetingStatus.SCHEDULED
        ).length;
        const pendingLoans = mockLoans.filter(
          l => l.status === LoanStatus.UNDER_REVIEW
        ).length;
        const totalRevenue = mockLoans
          .filter(l => l.status === LoanStatus.APPROVED)
          .reduce((sum, loan) => sum + loan.amount, 0);

        setStats([
          {
            title: 'Active Users',
            value: activeUsers,
            icon: <PeopleIcon />,
            color: '#1976d2',
            change: '+5.2%',
          },
          {
            title: 'Upcoming Meetings',
            value: upcomingMeetings,
            icon: <EventIcon />,
            color: '#9c27b0',
            change: '+2',
          },
          {
            title: 'Pending Loans',
            value: pendingLoans,
            icon: <AssignmentIcon />,
            color: '#ed6c02',
            change: '-3',
          },
          {
            title: 'Approved Loans',
            value: Math.round(totalRevenue / 1000000),
            icon: <TrendingUpIcon />,
            color: '#2e7d32',
            change: '+12.5%',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const recentMeetings = mockMeetings.slice(0, 5);
  const pendingActions = mockLoans
    .filter(l => l.status === LoanStatus.UNDER_REVIEW)
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of system activities and metrics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
                {stat.change && (
                  <Typography
                    variant="caption"
                    color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                  >
                    {stat.change} from last month
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Meetings
              </Typography>
              <List>
                {recentMeetings.map((meeting) => (
                  <ListItem key={meeting.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={meeting.title}
                      secondary={format(new Date(meeting.date), 'PPP')}
                    />
                    <Chip
                      label={meeting.status}
                      size="small"
                      color={
                        meeting.status === MeetingStatus.COMPLETED
                          ? 'success'
                          : meeting.status === MeetingStatus.SCHEDULED
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Meetings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Actions
              </Typography>
              <List>
                {pendingActions.map((loan) => (
                  <ListItem key={loan.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${loan.applicantName} - ${loan.loanType}`}
                      secondary={`KSH ${loan.amount.toLocaleString()}`}
                    />
                    <Chip
                      label={loan.urgency}
                      size="small"
                      color={
                        loan.urgency === 'critical'
                          ? 'error'
                          : loan.urgency === 'high'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Pending
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {mockUsers.slice(0, 5).map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemAvatar>
                      <Avatar src={user.avatar}>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={`${user.role} - Last login: ${
                        user.lastLogin
                          ? format(new Date(user.lastLogin), 'PPpp')
                          : 'Never'
                      }`}
                    />
                    {user.isActive ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <WarningIcon color="disabled" />
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
