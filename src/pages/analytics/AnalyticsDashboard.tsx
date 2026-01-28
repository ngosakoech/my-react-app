import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Paper,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { mockMeetings } from '../../mocks/meetings.mock';
import { mockResolutions } from '../../mocks/resolutions.mock';
import { TrendingUp, Event, Assessment, HowToVote } from '@mui/icons-material';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0'];

export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const meetingTrend = [
    { month: 'Jan', meetings: 4, attendance: 92 },
    { month: 'Feb', meetings: 3, attendance: 88 },
    { month: 'Mar', meetings: 5, attendance: 95 },
    { month: 'Apr', meetings: 4, attendance: 90 },
    { month: 'May', meetings: 3, attendance: 87 },
    { month: 'Jun', meetings: 4, attendance: 93 },
  ];

  const loanData = [
    { type: 'Personal', count: 45, amount: 12500000 },
    { type: 'Business', count: 32, amount: 28000000 },
    { type: 'Emergency', count: 18, amount: 5400000 },
    { type: 'Education', count: 25, amount: 8750000 },
    { type: 'Agriculture', count: 15, amount: 6200000 },
  ];

  const votingParticipation = [
    { name: 'Participated', value: 85 },
    { name: 'Pending', value: 15 },
  ];

  const financialTrend = [
    { month: 'Jan', approved: 15000000, disbursed: 14200000 },
    { month: 'Feb', approved: 18000000, disbursed: 17500000 },
    { month: 'Mar', approved: 22000000, disbursed: 21000000 },
    { month: 'Apr', approved: 19000000, disbursed: 18500000 },
    { month: 'May', approved: 25000000, disbursed: 24000000 },
    { month: 'Jun', approved: 28000000, disbursed: 27200000 },
  ];

  const kpiCards = [
    {
      title: 'Total Meetings',
      value: mockMeetings.length,
      change: '+12%',
      icon: <Event />,
      color: '#1976d2',
    },
    {
      title: 'Loan Portfolio',
      value: 'KSH 127M',
      change: '+18%',
      icon: <TrendingUp />,
      color: '#2e7d32',
    },
    {
      title: 'Active Resolutions',
      value: mockResolutions.filter((r) => r.status === 'active').length,
      change: '+5%',
      icon: <HowToVote />,
      color: '#9c27b0',
    },
    {
      title: 'Approval Rate',
      value: '87%',
      change: '+3%',
      icon: <Assessment />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="1month">Last Month</MenuItem>
          <MenuItem value="3months">Last 3 Months</MenuItem>
          <MenuItem value="6months">Last 6 Months</MenuItem>
          <MenuItem value="1year">Last Year</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiCards.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {kpi.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: kpi.color,
                      color: 'white',
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {kpi.icon}
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color={kpi.change.startsWith('+') ? 'success.main' : 'error.main'}
                >
                  {kpi.change} from previous period
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meeting Trends & Attendance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={meetingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="meetings"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="Meetings"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendance"
                    stroke="#2e7d32"
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={financialTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stackId="1"
                    stroke="#1976d2"
                    fill="#1976d2"
                    name="Approved (KSH)"
                  />
                  <Area
                    type="monotone"
                    dataKey="disbursed"
                    stackId="2"
                    stroke="#2e7d32"
                    fill="#2e7d32"
                    name="Disbursed (KSH)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Distribution by Type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={loanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => entry.type}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {loanData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voting Participation
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={votingParticipation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {votingParticipation.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#2e7d32' : '#ed6c02'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Meeting Duration
                  </Typography>
                  <Typography variant="h6">2.5 hours</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Loan Approval Rate
                  </Typography>
                  <Typography variant="h6">87%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Resolution Pass Rate
                  </Typography>
                  <Typography variant="h6">92%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Engagement
                  </Typography>
                  <Typography variant="h6">95%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Applications by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" name="Applications" />
                  <Bar dataKey="amount" fill="#2e7d32" name="Amount (KSH)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Power BI Integration
              </Typography>
              <Typography variant="body2">
                Advanced analytics and custom reports are available through our Power BI
                integration. Contact your administrator for access.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
