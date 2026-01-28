import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockLoans } from '../../mocks/loans.mock';
import { type LoanApplication } from '../../types';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadLoan = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const foundLoan = mockLoans.find((l) => l.id === id);
        setLoan(foundLoan || null);
      } finally {
        setLoading(false);
      }
    };

    loadLoan();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading loan details..." />;
  }

  if (!loan) {
    return (
      <EmptyState
        title="Loan not found"
        description="The loan application you're looking for doesn't exist"
        action={
          <Button variant="contained" onClick={() => navigate('/loans')}>
            Back to Loans
          </Button>
        }
      />
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/loans')}
          sx={{ cursor: 'pointer' }}
        >
          Loans
        </Link>
        <Typography color="text.primary">{loan.id}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/loans')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Loan Application Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <StatusBadge status={loan.status} />
            <Chip label={loan.loanType} size="small" />
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
        </Box>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          onClick={() => navigate(`/loans/${loan.id}/appraisal`)}
        >
          Review
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
              <Tab label="Overview" />
              <Tab label="Recommendations" />
              <Tab label="Documents" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Applicant Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">{loan.applicantName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{loan.applicantEmail}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{loan.applicantPhone}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Credit Score
                    </Typography>
                    <Typography variant="body1">
                      {loan.creditScore || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Annual Income
                    </Typography>
                    <Typography variant="body1">
                      {loan.income ? `KSH ${loan.income.toLocaleString()}` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Collateral
                    </Typography>
                    <Typography variant="body1">{loan.collateral || 'None'}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Loan Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Amount Requested
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      KSH {loan.amount.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Repayment Term
                    </Typography>
                    <Typography variant="body1">{loan.term} months</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1">{loan.purpose}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Submitted Date
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(loan.submittedDate), 'PP')}
                    </Typography>
                  </Grid>
                  {loan.disbursementDate && (
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Disbursement Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(loan.disbursementDate), 'PP')}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <CardContent>
                {loan.recommendations.length > 0 ? (
                  <List>
                    {loan.recommendations.map((rec) => (
                      <Box key={rec.id} sx={{ mb: 3 }}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {rec.reviewerName}
                                </Typography>
                                <Chip
                                  label={rec.recommendation}
                                  size="small"
                                  color={
                                    rec.recommendation === 'approve'
                                      ? 'success'
                                      : rec.recommendation === 'reject'
                                      ? 'error'
                                      : 'warning'
                                  }
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                                  {rec.comments}
                                </Typography>
                                {rec.conditions && rec.conditions.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" fontWeight="bold">
                                      Conditions:
                                    </Typography>
                                    <List dense>
                                      {rec.conditions.map((condition, idx) => (
                                        <ListItem key={idx} sx={{ py: 0 }}>
                                          <Typography variant="caption">
                                            • {condition}
                                          </Typography>
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(rec.date), 'PPpp')}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </Box>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    title="No recommendations yet"
                    description="Recommendations will appear here once submitted"
                  />
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <CardContent>
                {loan.documents.length > 0 ? (
                  <List>
                    {loan.documents.map((docId) => (
                      <ListItem key={docId}>
                        <DescriptionIcon sx={{ mr: 2 }} />
                        <ListItemText
                          primary={`Document ${docId}`}
                          secondary="Application document"
                        />
                        <Button size="small">Download</Button>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <EmptyState
                    icon={DescriptionIcon}
                    title="No documents"
                    description="Documents will be listed here"
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
                Status Timeline
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Submitted"
                    secondary={format(new Date(loan.submittedDate), 'PPp')}
                  />
                  <Chip label="✓" size="small" color="success" />
                </ListItem>
                {loan.reviewedDate && (
                  <ListItem>
                    <ListItemText
                      primary="Under Review"
                      secondary={format(new Date(loan.reviewedDate), 'PPp')}
                    />
                    <Chip label="✓" size="small" color="success" />
                  </ListItem>
                )}
                {loan.finalDecision && (
                  <ListItem>
                    <ListItemText
                      primary={loan.finalDecision.decision === 'approved' ? 'Approved' : 'Rejected'}
                      secondary={format(new Date(loan.finalDecision.decisionDate), 'PPp')}
                    />
                    <Chip
                      label="✓"
                      size="small"
                      color={loan.finalDecision.decision === 'approved' ? 'success' : 'error'}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {loan.finalDecision && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Final Decision
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Decision
                    </Typography>
                    <Typography variant="h6">
                      <Chip
                        label={loan.finalDecision.decision}
                        color={
                          loan.finalDecision.decision === 'approved'
                            ? 'success'
                            : 'error'
                        }
                      />
                    </Typography>
                  </Box>
                  {loan.finalDecision.amount && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Approved Amount
                      </Typography>
                      <Typography variant="body1">
                        KSH {loan.finalDecision.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                  {loan.finalDecision.interestRate && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography variant="body1">
                        {loan.finalDecision.interestRate}%
                      </Typography>
                    </Box>
                  )}
                  {loan.finalDecision.comments && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Comments
                      </Typography>
                      <Typography variant="body2">
                        {loan.finalDecision.comments}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
