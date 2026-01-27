import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  TextField,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { mockLoans } from '../../mocks/loans.mock';
import { type LoanApplication } from '../../types';
import { format } from 'date-fns';

const recommendationSchema = z.object({
  recommendation: z.enum(['approve', 'reject', 'conditional']),
  comments: z.string().min(20, 'Comments must be at least 20 characters'),
  conditions: z.string().optional(),
});

type RecommendationFormData = z.infer<typeof recommendationSchema>;

export const LoanAppraisal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      recommendation: 'approve',
      comments: '',
      conditions: '',
    },
  });

  const recommendation = watch('recommendation');

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

  const onSubmit = async (data: RecommendationFormData) => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Recommendation submitted:', data);
      navigate('/loans');
    } finally {
      setSubmitting(false);
    }
  };

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

  const riskScore = loan.creditScore
    ? loan.creditScore > 700
      ? 'Low'
      : loan.creditScore > 600
      ? 'Medium'
      : 'High'
    : 'Unknown';

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
        <Typography color="text.primary">Appraisal - {loan.id}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/loans')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Loan Appraisal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and provide recommendation for loan application
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ mb: 3 }}>
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
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Loan Type
                  </Typography>
                  <Typography variant="body1">
                    <Chip label={loan.loanType} size="small" color="primary" />
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Amount Requested
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    KSH {loan.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Repayment Term
                  </Typography>
                  <Typography variant="body1">{loan.term} months</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Submitted Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(loan.submittedDate), 'PP')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Purpose
                  </Typography>
                  <Typography variant="body1">{loan.purpose}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Recommendation
              </Typography>
              <Divider sx={{ my: 2 }} />
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="recommendation"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Recommendation"
                          error={!!errors.recommendation}
                          helperText={errors.recommendation?.message}
                        >
                          <MenuItem value="approve">Approve</MenuItem>
                          <MenuItem value="reject">Reject</MenuItem>
                          <MenuItem value="conditional">Conditional Approval</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  {recommendation === 'conditional' && (
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="conditions"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={3}
                            label="Conditions"
                            placeholder="List the conditions for approval..."
                          />
                        )}
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="comments"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          label="Comments"
                          placeholder="Provide your detailed assessment..."
                          error={!!errors.comments}
                          helperText={errors.comments?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/loans')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        startIcon={
                          recommendation === 'reject' ? (
                            <CancelIcon />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        color={recommendation === 'reject' ? 'error' : 'primary'}
                      >
                        {submitting ? 'Submitting...' : 'Submit Recommendation'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Assessment
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Risk Level
                  </Typography>
                  <Typography variant="h6">
                    <Chip
                      label={riskScore}
                      color={
                        riskScore === 'Low'
                          ? 'success'
                          : riskScore === 'Medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Debt-to-Income Ratio
                  </Typography>
                  <Typography variant="body1">
                    {loan.income
                      ? `${((loan.amount / loan.income) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Urgency
                  </Typography>
                  <Typography variant="body1">
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
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Previous Recommendations
              </Typography>
              <Divider sx={{ my: 2 }} />
              {loan.recommendations.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {loan.recommendations.map((rec) => (
                    <Box key={rec.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2">{rec.reviewerName}</Typography>
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
                      <Typography variant="body2" color="text.secondary">
                        {rec.comments}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(rec.date), 'PPp')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No recommendations yet
                </Typography>
              )}
            </CardContent>
          </Card>

          <Alert severity="info">
            <Typography variant="body2">
              Your recommendation will be reviewed by the board before final decision.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
