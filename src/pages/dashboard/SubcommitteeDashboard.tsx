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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Description,
  CalendarMonth,
  TrendingUp,
  CheckCircle,
  Pending,
  RateReview,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { AppLayout } from '../../components/layout/AppLayout';
import { getUpcomingMeetings } from '../../mocks/meetings.mock';
import { getRecentDocuments, getDocumentsByCategory } from '../../mocks/documents.mock';
import { MeetingType } from '../../types/meeting.types';
import { DocumentCategory } from '../../types/document.types';
import { formatCurrency } from '../../utils/helpers';

export const SubcommitteeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading: meetingsLoading } = useMeetingContext();
  const { loading: documentsLoading } = useDocumentContext();

  const upcomingSubcommitteeMeetings = getUpcomingMeetings().filter(
    (m) => m.type === MeetingType.SUBCOMMITTEE
  );
  const loanDocuments = getDocumentsByCategory(DocumentCategory.LOAN);
  const recentDocs = getRecentDocuments(5);

  const [subcommitteeType] = useState('Credit Committee');

  const pendingLoanAppraisals = [
    {
      id: 'LN-2024-005',
      applicant: 'Francis Kariuki',
      amount: 5000000,
      type: 'Business Loan',
      status: 'pending',
      submittedDate: new Date('2024-01-15'),
      priority: 'high',
    },
    {
      id: 'LN-2024-006',
      applicant: 'Mary Njeri',
      amount: 1200000,
      type: 'Agriculture Loan',
      status: 'pending',
      submittedDate: new Date('2024-01-18'),
      priority: 'medium',
    },
    {
      id: 'LN-2024-007',
      applicant: 'Peter Waweru',
      amount: 800000,
      type: 'Education Loan',
      status: 'review',
      submittedDate: new Date('2024-01-20'),
      priority: 'medium',
    },
    {
      id: 'LN-2024-008',
      applicant: 'Jane Achieng',
      amount: 350000,
      type: 'Emergency Loan',
      status: 'pending',
      submittedDate: new Date('2024-01-22'),
      priority: 'high',
    },
  ];

  const taskUpdates = [
    {
      id: 1,
      title: 'Complete risk assessment for LN-2024-005',
      status: 'in-progress',
      progress: 65,
      dueDate: '2024-02-25',
    },
    {
      id: 2,
      title: 'Review collateral documentation for LN-2024-006',
      status: 'pending',
      progress: 20,
      dueDate: '2024-02-28',
    },
    {
      id: 3,
      title: 'Prepare monthly portfolio report',
      status: 'in-progress',
      progress: 45,
      dueDate: '2024-02-29',
    },
    {
      id: 4,
      title: 'Update credit policy recommendations',
      status: 'pending',
      progress: 0,
      dueDate: '2024-03-05',
    },
  ];

  const performanceMetrics = [
    { month: 'Aug', processed: 45, approved: 38, rejected: 7, avgTime: 5.2 },
    { month: 'Sep', processed: 52, approved: 44, rejected: 8, avgTime: 4.8 },
    { month: 'Oct', processed: 48, approved: 41, rejected: 7, avgTime: 5.0 },
    { month: 'Nov', processed: 55, approved: 47, rejected: 8, avgTime: 4.5 },
    { month: 'Dec', processed: 60, approved: 52, rejected: 8, avgTime: 4.2 },
    { month: 'Jan', processed: 58, approved: 50, rejected: 8, avgTime: 4.0 },
  ];

  const portfolioHealthData = [
    { month: 'Aug', performing: 92, nonPerforming: 8, watchList: 12 },
    { month: 'Sep', performing: 93, nonPerforming: 7, watchList: 11 },
    { month: 'Oct', performing: 94, nonPerforming: 6, watchList: 10 },
    { month: 'Nov', performing: 93.5, nonPerforming: 6.5, watchList: 11 },
    { month: 'Dec', performing: 94.5, nonPerforming: 5.5, watchList: 9 },
    { month: 'Jan', performing: 95, nonPerforming: 5, watchList: 8 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Approved loan application LN-2024-004',
      user: 'Elizabeth Wangari',
      timestamp: new Date('2024-01-24T14:30:00'),
    },
    {
      id: 2,
      action: 'Submitted credit assessment report',
      user: 'Michael Otieno',
      timestamp: new Date('2024-01-24T11:15:00'),
    },
    {
      id: 3,
      action: 'Updated portfolio risk metrics',
      user: 'Elizabeth Wangari',
      timestamp: new Date('2024-01-23T16:45:00'),
    },
    {
      id: 4,
      action: 'Reviewed collateral documentation',
      user: 'Michael Otieno',
      timestamp: new Date('2024-01-23T10:20:00'),
    },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
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
          {subcommitteeType} Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back, {user?.firstName}! Monitor and manage subcommittee activities.
        </Typography>

        {/* Key Metrics Cards */}
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
                    Pending Reviews
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {pendingLoanAppraisals.filter((l) => l.status === 'pending').length}
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    Requires attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <Pending fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Tasks
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {taskUpdates.filter((t) => t.status !== 'completed').length}
                  </Typography>
                  <Typography variant="caption" color="info.main">
                    In progress
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Assignment fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Documents
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {loanDocuments.length}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    Available
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <Description fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Meetings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {upcomingSubcommitteeMeetings.length}
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    Scheduled
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <CalendarMonth fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: 3 }}>
          {/* Pending Loan Appraisals */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 7' } }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Pending Loan Appraisals
                </Typography>
                <Button size="small" onClick={() => navigate('/loans')}>
                  View All
                </Button>
              </Box>
              {pendingLoanAppraisals.length === 0 ? (
                <Alert severity="success">No pending loan appraisals</Alert>
              ) : (
                <List>
                  {pendingLoanAppraisals.map((loan) => (
                    <ListItem
                      key={loan.id}
                      divider
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => navigate(`/loans/${loan.id}`)}
                      secondaryAction={
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip label={loan.priority} size="small" color={getPriorityColor(loan.priority)} />
                          <Button size="small" variant="contained" startIcon={<RateReview />}>
                            Review
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{loan.id.slice(-2)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${loan.applicant} - ${loan.type}`}
                        secondary={
                          <>
                            Amount: {formatCurrency(loan.amount, 'KES', 'en-KE')} •{' '}
                            {loan.submittedDate.toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Task Updates */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 5' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Subcommittee Task Updates
              </Typography>
              {taskUpdates.map((task) => (
                <Box key={task.id} sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {task.title}
                    </Typography>
                    <Chip label={task.status} size="small" color={getStatusColor(task.status)} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="caption" fontWeight="medium">
                      {task.progress}%
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Due: {task.dueDate}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>

          {/* Loan Processing Performance */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 8' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Loan Processing Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="processed" fill="#0088FE" name="Processed" />
                  <Bar dataKey="approved" fill="#00C49F" name="Approved" />
                  <Bar dataKey="rejected" fill="#FF8042" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Average Processing Time */}
          <Box sx={{ gridColumn: { xs: 'span 1', lg: 'span 4' } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Avg Processing Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="Days"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box textAlign="center" mt={2}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  4.0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average days (Jan 2024)
                </Typography>
                <Chip
                  icon={<TrendingUp />}
                  label="15% improvement"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Paper>
          </Box>

          {/* Portfolio Health */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Portfolio Health Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={portfolioHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="performing"
                    stackId="1"
                    stroke="#00C49F"
                    fill="#00C49F"
                    fillOpacity={0.6}
                    name="Performing %"
                  />
                  <Area
                    type="monotone"
                    dataKey="nonPerforming"
                    stackId="2"
                    stroke="#FF8042"
                    fill="#FF8042"
                    fillOpacity={0.6}
                    name="Non-Performing %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Subcommittee Documents */}
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
                  {recentDocs.slice(0, 5).map((doc) => (
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
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Subcommittee Meetings */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Meetings
                </Typography>
                <Button size="small" onClick={() => navigate('/meetings')}>
                  View Calendar
                </Button>
              </Box>
              {upcomingSubcommitteeMeetings.length === 0 ? (
                <Alert severity="info">No upcoming subcommittee meetings</Alert>
              ) : (
                <List>
                  {upcomingSubcommitteeMeetings.slice(0, 4).map((meeting) => (
                    <ListItem
                      key={meeting.id}
                      divider
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => navigate(`/meetings/${meeting.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <CalendarMonth />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={meeting.title}
                        secondary={`${meeting.date.toLocaleDateString()} at ${meeting.time}`}
                      />
                      <Chip label={meeting.type} size="small" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Recent Activity */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activity in Subcommittee
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <CheckCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.user} • ${activity.timestamp.toLocaleString()}`}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default SubcommitteeDashboard;
