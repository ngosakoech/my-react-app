import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Event,
  CheckCircle,
  Description,
  Add,
  Announcement,
  ManageAccounts,
  TrendingUp,
  TrendingDown,
  Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useMeetingContext } from '../../contexts/MeetingContext';
import { useDocumentContext } from '../../contexts/DocumentContext';
import { useVotingContext } from '../../contexts/VotingContext';
import { AppLayout } from '../../components/layout/AppLayout';
import { mockUsers } from '../../mocks/users.mock';
import { getUpcomingMeetings } from '../../mocks/meetings.mock';
import { getRecentDocuments } from '../../mocks/documents.mock';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { meetings, loading: meetingsLoading } = useMeetingContext();
  const { documents, loading: documentsLoading } = useDocumentContext();
  const { resolutions } = useVotingContext();

  const [systemHealth] = useState({
    server: 'operational',
    database: 'operational',
    storage: 'warning',
    backup: 'operational',
  });

  const upcomingMeetings = getUpcomingMeetings().slice(0, 5);
  const recentDocs = getRecentDocuments(5);
  const activeUsers = mockUsers.filter(u => u.isActive);
  const pendingApprovals = resolutions.filter(r => r.status === 'active').length;

  const userEngagementData = [
    { month: 'Jan', logins: 120, documents: 45, votes: 32 },
    { month: 'Feb', logins: 135, documents: 52, votes: 38 },
    { month: 'Mar', logins: 148, documents: 61, votes: 42 },
    { month: 'Apr', logins: 152, documents: 58, votes: 45 },
    { month: 'May', logins: 165, documents: 67, votes: 48 },
    { month: 'Jun', logins: 178, documents: 72, votes: 51 },
  ];

  const activityData = [
    { name: 'Meetings', value: meetings.length },
    { name: 'Documents', value: documents.length },
    { name: 'Users', value: activeUsers.length },
    { name: 'Resolutions', value: resolutions.length },
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah Wanjiru', action: 'Created Q1 2024 Board Meeting', time: '2 hours ago', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 2, user: 'Grace Muthoni', action: 'Uploaded Budget 2024 document', time: '3 hours ago', avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 3, user: 'James Njoroge', action: 'Approved minutes from Q4 2023', time: '5 hours ago', avatar: 'https://i.pravatar.cc/150?img=51' },
    { id: 4, user: 'Peter Omondi', action: 'Updated meeting agenda', time: '6 hours ago', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 5, user: 'Mary Akinyi', action: 'Cast vote on Resolution RES-2024-003', time: '8 hours ago', avatar: 'https://i.pravatar.cc/150?img=20' },
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <TrendingUp color="success" />;
      case 'warning':
        return <TrendingDown color="warning" />;
      default:
        return <Circle color="error" />;
    }
  };

  if (meetingsLoading || documentsLoading) {
    return (
      <AppLayout userRole={user?.role}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole={user?.role}>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back, {user?.firstName}! Here's your system overview.
        </Typography>

        {/* Overview Metrics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {activeUsers.length}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +3 this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <People fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Meetings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {upcomingMeetings.length}
                  </Typography>
                  <Typography variant="caption" color="info.main">
                    {meetings.length} total
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Event fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {pendingApprovals}
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    Requires action
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <CheckCircle fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Document Count
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {documents.length}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {recentDocs.length} recent
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <Description fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/meetings/create')}
            >
              Create Meeting
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Announcement />}
              onClick={() => navigate('/announcements/new')}
            >
              Send Announcement
            </Button>
            <Button
              variant="outlined"
              startIcon={<ManageAccounts />}
              onClick={() => navigate('/users')}
            >
              Manage Users
            </Button>
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: 3 }}>
          {/* User Engagement Chart */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 8' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                User Engagement Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="logins" stroke="#8884d8" strokeWidth={2} name="Logins" />
                  <Line type="monotone" dataKey="documents" stroke="#82ca9d" strokeWidth={2} name="Documents" />
                  <Line type="monotone" dataKey="votes" stroke="#ffc658" strokeWidth={2} name="Votes" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Activity Distribution */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 4' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Activity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* System Health Indicators */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                System Health
              </Typography>
              <List>
                {Object.entries(systemHealth).map(([key, status]) => (
                  <ListItem key={key}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        {getHealthIcon(status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={key.charAt(0).toUpperCase() + key.slice(1)}
                      secondary={status}
                    />
                    <Chip
                      label={status}
                      color={getHealthColor(status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Recent Activity Timeline */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemAvatar>
                      <Avatar src={activity.avatar} alt={activity.user} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} • ${activity.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Upcoming Meetings */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Meetings
                </Typography>
                <Button size="small" onClick={() => navigate('/meetings')}>
                  View All
                </Button>
              </Box>
              {upcomingMeetings.length === 0 ? (
                <Alert severity="info">No upcoming meetings scheduled</Alert>
              ) : (
                <List>
                  {upcomingMeetings.map((meeting) => (
                    <ListItem
                      key={meeting.id}
                      divider
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => navigate(`/meetings/${meeting.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Event />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={meeting.title}
                        secondary={`${meeting.date.toLocaleDateString()} at ${meeting.time} • ${meeting.location}`}
                      />
                      <Chip label={meeting.type} size="small" color="primary" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default AdminDashboard;
