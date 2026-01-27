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
  Alert,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { mockDocuments } from '../../mocks/documents.mock';
import { mockLoans } from '../../mocks/loans.mock';
import { LoanStatus } from '../../types';
import { format } from 'date-fns';

export const SubcommitteeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const subcommitteeLoans = mockLoans
    .filter((l) => l.status === LoanStatus.UNDER_REVIEW)
    .slice(0, 5);

  const subcommitteeDocuments = mockDocuments
    .filter((d) => d.category === 'loan' || d.category === 'report')
    .slice(0, 5);

  const stats = [
    {
      label: 'Pending Reviews',
      value: subcommitteeLoans.length,
      icon: <WarningIcon />,
      color: '#ed6c02',
    },
    {
      label: 'Completed Reviews',
      value: '24',
      icon: <CheckCircleIcon />,
      color: '#2e7d32',
    },
    {
      label: 'Documents',
      value: subcommitteeDocuments.length,
      icon: <DescriptionIcon />,
      color: '#1976d2',
    },
    {
      label: 'Recommendations',
      value: '18',
      icon: <AssignmentIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Subcommittee Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {user?.firstName}! Here are your subcommittee tasks
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          You have {subcommitteeLoans.length} loan applications pending your review.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Loan Reviews
              </Typography>
              <List>
                {subcommitteeLoans.map((loan) => (
                  <ListItem key={loan.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            loan.urgency === 'critical'
                              ? 'error.main'
                              : loan.urgency === 'high'
                              ? 'warning.main'
                              : 'info.main',
                        }}
                      >
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {loan.applicantName}
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
                        </Box>
                      }
                      secondary={
                        <>
                          {loan.loanType} • KSH {loan.amount.toLocaleString()}
                          <br />
                          Submitted: {format(new Date(loan.submittedDate), 'PP')}
                        </>
                      }
                    />
                    <Button variant="contained" size="small">
                      Review
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Pending
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  fullWidth
                >
                  Submit Recommendation
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                >
                  View Documents
                </Button>
                <Button variant="outlined" startIcon={<InfoIcon />} fullWidth>
                  Committee Guidelines
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Approved loan LN-2024-045"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reviewed document DOC-789"
                    secondary="5 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Submitted recommendation"
                    secondary="Yesterday"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subcommittee Documents
              </Typography>
              <List>
                {subcommitteeDocuments.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doc.title}
                      secondary={
                        <>
                          {doc.category} • Uploaded {format(new Date(doc.uploadedDate), 'PP')}
                        </>
                      }
                    />
                    <Chip
                      label={doc.isConfidential ? 'Confidential' : 'Public'}
                      size="small"
                      color={doc.isConfidential ? 'error' : 'default'}
                    />
                    <Button size="small" sx={{ ml: 1 }}>
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                Browse All Documents
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
