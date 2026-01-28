import { useState } from 'react';
import {
  Box,
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
  Badge,
  IconButton,
  Divider,
} from '@mui/material';
import {
  CalendarMonth,
  Assignment,
  Description,
  VideoCall,
  ArrowForward,
  CheckCircle,
  PendingActions,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useMeetingContext } from '../../contexts/MeetingContext';
import { useDocumentContext } from '../../contexts/DocumentContext';
import { useVotingContext } from '../../contexts/VotingContext';
import { AppLayout } from '../../components/layout/AppLayout';
import { getUpcomingMeetings } from '../../mocks/meetings.mock';
import { getRecentDocuments } from '../../mocks/documents.mock';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface LoanPortfolioItem {
  category: string;
  value: number;
  amount: number;
}

export const BoardMemberDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { meetings, loading: meetingsLoading } = useMeetingContext();
  const { documents, loading: documentsLoading } = useDocumentContext();
  const { resolutions } = useVotingContext();

  const upcomingMeetings = getUpcomingMeetings().slice(0, 4);
  const recentDocs = getRecentDocuments(4);

  const [selectedDate] = useState(new Date());

  const pendingTasks = [
    { id: 1, title: 'Vote on Resolution RES-2024-003', type: 'vote', priority: 'high', dueDate: new Date('2024-02-28') },
    { id: 2, title: 'Review Budget 2024 Document', type: 'review', priority: 'medium', dueDate: new Date('2024-02-25') },
    { id: 3, title: 'Approve Q4 2023 Minutes', type: 'approval', priority: 'high', dueDate: new Date('2024-02-20') },
    { id: 4, title: 'Submit Strategic Plan Feedback', type: 'feedback', priority: 'low', dueDate: new Date('2024-03-05') },
  ];

  const actionItems = [
    { id: 1, title: 'Review loan application LN-2024-005', assignedBy: 'Elizabeth Wangari', dueDate: '2024-02-22' },
    { id: 2, title: 'Prepare Q1 financial analysis', assignedBy: 'Grace Muthoni', dueDate: '2024-02-25' },
    { id: 3, title: 'Update governance policy document', assignedBy: 'Peter Omondi', dueDate: '2024-02-28' },
  ];

  const organizationalMetrics = [
    { month: 'Aug', revenue: 4200, expenses: 3800, growth: 10.5 },
    { month: 'Sep', revenue: 4500, expenses: 3900, growth: 12.3 },
    { month: 'Oct', revenue: 4800, expenses: 4100, growth: 14.1 },
    { month: 'Nov', revenue: 5100, expenses: 4200, growth: 15.8 },
    { month: 'Dec', revenue: 5400, expenses: 4400, growth: 17.2 },
    { month: 'Jan', revenue: 5700, expenses: 4500, growth: 19.5 },
  ];

  const membershipData = [
    { month: 'Aug', active: 450, new: 25, inactive: 10 },
    { month: 'Sep', active: 465, new: 30, inactive: 15 },
    { month: 'Oct', active: 480, new: 28, inactive: 13 },
    { month: 'Nov', active: 495, new: 32, inactive: 17 },
    { month: 'Dec', active: 510, new: 35, inactive: 20 },
    { month: 'Jan', active: 525, new: 40, inactive: 25 },
  ];

  const performanceData = [
    { name: 'Attendance', value: 95, color: '#0088FE' },
    { name: 'Task Completion', value: 88, color: '#00C49F' },
    { name: 'Vote Participation', value: 92, color: '#FFBB28' },
    { name: 'Document Reviews', value: 85, color: '#FF8042' },
  ];

  const loanPortfolioData: LoanPortfolioItem[] = [
    { category: 'Business', value: 35, amount: 45000000 },
    { category: 'Personal', value: 28, amount: 28000000 },
    { category: 'Agriculture', value: 20, amount: 25000000 },
    { category: 'Education', value: 12, amount: 12000000 },
    { category: 'Emergency', value: 5, amount: 5000000 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <CheckCircle />;
      case 'review':
        return <Description />;
      case 'approval':
        return <PendingActions />;
      default:
        return <Assignment />;
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
          Board Member Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back, {user?.firstName}! Here's your personalized board overview.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 3 }}>
          {/* Calendar Widget */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 4' } }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Calendar
                </Typography>
                <IconButton size="small" onClick={() => navigate('/meetings')}>
                  <CalendarMonth />
                </IconButton>
              </Box>
              <Box textAlign="center" mb={3}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {selectedDate.getDate()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Upcoming This Month
              </Typography>
              <List dense>
                {upcomingMeetings.slice(0, 3).map((meeting) => (
                  <ListItem key={meeting.id} disablePadding sx={{ py: 0.5 }}>
                    <Typography variant="body2" noWrap>
                      • {meeting.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => navigate('/meetings')}
              >
                View Full Calendar
              </Button>
            </Paper>
          </Box>

          {/* Pending Tasks Widget */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 8' } }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Pending Tasks
                </Typography>
                <Badge badgeContent={pendingTasks.length} color="error">
                  <PendingActions />
                </Badge>
              </Box>
              {pendingTasks.length === 0 ? (
                <Alert severity="success">All tasks completed! Great job!</Alert>
              ) : (
                <List>
                  {pendingTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      divider
                      secondaryAction={
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                          />
                          <IconButton edge="end" size="small">
                            <ArrowForward />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getTaskIcon(task.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={`Due: ${task.dueDate.toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Financial Performance Chart */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Financial Performance
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={organizationalMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue (000s)" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses (000s)" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Growth Trend Chart */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Growth Trend
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={organizationalMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stroke="#00C49F"
                    fill="#00C49F"
                    fillOpacity={0.6}
                    name="Growth %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Membership Trends */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 8' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Membership Trends
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={membershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#0088FE" strokeWidth={2} name="Active Members" />
                  <Line type="monotone" dataKey="new" stroke="#00C49F" strokeWidth={2} name="New Members" />
                  <Line type="monotone" dataKey="inactive" stroke="#FF8042" strokeWidth={2} name="Inactive" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Loan Portfolio Distribution */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 4' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Loan Portfolio
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={loanPortfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const entry = props as LoanPortfolioItem;
                      return `${entry.category} ${entry.value}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanPortfolioData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Recent Documents */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Documents
                </Typography>
                <Button size="small" onClick={() => navigate('/documents')}>
                  View All
                </Button>
              </Box>
              {recentDocs.length === 0 ? (
                <Alert severity="info">No recent documents</Alert>
              ) : (
                <List>
                  {recentDocs.map((doc) => (
                    <ListItem
                      key={doc.id}
                      divider
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <Description />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={doc.title}
                        secondary={doc.uploadedDate.toLocaleDateString()}
                      />
                      {doc.isConfidential && (
                        <Chip label="Confidential" size="small" color="error" variant="outlined" />
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Upcoming Meetings with Quick Join */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
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
                <Alert severity="info">No upcoming meetings</Alert>
              ) : (
                <List>
                  {upcomingMeetings.map((meeting) => (
                    <ListItem
                      key={meeting.id}
                      divider
                      secondaryAction={
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<VideoCall />}
                          onClick={() => navigate(`/meetings/${meeting.id}/join`)}
                        >
                          Join
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={meeting.title}
                        secondary={`${meeting.date.toLocaleDateString()} at ${meeting.time}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Action Items Assigned */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Action Items Assigned to You
              </Typography>
              <List>
                {actionItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <Assignment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={`Assigned by ${item.assignedBy} • Due: ${item.dueDate}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Personal Performance Metrics */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Your Performance Metrics
              </Typography>
              <Box sx={{ mt: 2 }}>
                {performanceData.map((metric) => (
                  <Box key={metric.name} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{metric.name}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metric.value}%
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
                          width: `${metric.value}%`,
                          height: '100%',
                          bgcolor: metric.color,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingUp />}
                sx={{ mt: 2 }}
                onClick={() => navigate('/analytics')}
              >
                View Detailed Analytics
              </Button>
            </Paper>
          </Box>

          {/* Activity Summary */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Activity Summary
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {meetings.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meetings Attended
                  </Typography>
                </Box>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {resolutions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Votes Cast
                  </Typography>
                </Box>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {documents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documents Reviewed
                  </Typography>
                </Box>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {pendingTasks.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Tasks
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default BoardMemberDashboard;
