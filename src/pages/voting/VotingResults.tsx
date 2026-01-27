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
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  HowToVote as VoteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockResolutions } from '../../mocks/resolutions.mock';
import type { Resolution } from '../../types';
import { VoteDecision } from '../../types';
import { format } from 'date-fns';

const COLORS = {
  yes: '#2e7d32',
  no: '#d32f2f',
  abstain: '#ed6c02',
};

export const VotingResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [userVote, setUserVote] = useState<VoteDecision | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadResolution = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const foundResolution = mockResolutions.find((r) => r.id === id);
        setResolution(foundResolution || null);
      } finally {
        setLoading(false);
      }
    };

    loadResolution();
  }, [id]);

  const handleVoteSubmit = async () => {
    if (!userVote) return;
    
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Vote submitted:', { vote: userVote, comment });
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading resolution..." />;
  }

  if (!resolution) {
    return (
      <EmptyState
        title="Resolution not found"
        description="The resolution you're looking for doesn't exist"
        action={
          <Button variant="contained" onClick={() => navigate('/voting')}>
            Back to Voting
          </Button>
        }
      />
    );
  }

  const yesVotes = resolution.votes.filter((v) => v.decision === 'yes').length;
  const noVotes = resolution.votes.filter((v) => v.decision === 'no').length;
  const abstainVotes = resolution.votes.filter((v) => v.decision === 'abstain').length;
  const totalVotes = resolution.votes.length;

  const pieData = [
    { name: 'Yes', value: yesVotes },
    { name: 'No', value: noVotes },
    { name: 'Abstain', value: abstainVotes },
  ].filter((item) => item.value > 0);

  const barData = [
    { decision: 'Yes', count: yesVotes },
    { decision: 'No', count: noVotes },
    { decision: 'Abstain', count: abstainVotes },
  ];

  const hasVoted = resolution.votes.some((v) => v.userId === 'current-user');
  const isActive = resolution.status === 'active';

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/voting')}
          sx={{ cursor: 'pointer' }}
        >
          Voting
        </Link>
        <Typography color="text.primary">{resolution.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/voting')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {resolution.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <StatusBadge status={resolution.status} />
            <Chip label={resolution.votingRule.replace('_', ' ')} size="small" />
            {resolution.isAnonymous && (
              <Chip label="Anonymous" size="small" color="info" />
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {resolution.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Created by: {resolution.createdBy}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {format(new Date(resolution.createdDate), 'PPp')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Deadline: {format(new Date(resolution.votingDeadline), 'PPp')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {isActive && !hasVoted && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cast Your Vote
                </Typography>
                <Divider sx={{ my: 2 }} />
                <RadioGroup
                  value={userVote}
                  onChange={(e) => setUserVote(e.target.value as VoteDecision)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" />
                        <Typography>Vote Yes</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CancelIcon color="error" />
                        <Typography>Vote No</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="abstain"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VoteIcon color="warning" />
                        <Typography>Abstain</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a comment (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!userVote || submitting}
                  onClick={handleVoteSubmit}
                  sx={{ mt: 2 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Vote'}
                </Button>
              </CardContent>
            </Card>
          )}

          {hasVoted && (
            <Alert severity="success" sx={{ mb: 3 }}>
              You have already voted on this resolution. Thank you for your participation!
            </Alert>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voting Results
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Participation</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {totalVotes} votes cast
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((totalVotes / 10) * 100, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="decision" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vote Breakdown
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Yes</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {yesVotes} ({totalVotes > 0 ? ((yesVotes / totalVotes) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0}
                    color="success"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">No</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      {noVotes} ({totalVotes > 0 ? ((noVotes / totalVotes) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0}
                    color="error"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Abstain</Typography>
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      {abstainVotes} ({totalVotes > 0 ? ((abstainVotes / totalVotes) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0}
                    color="warning"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {resolution.result && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Final Result
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Chip
                    label={resolution.result.isPassed ? 'PASSED' : 'FAILED'}
                    color={resolution.result.isPassed ? 'success' : 'error'}
                    sx={{ fontSize: '1.2rem', p: 2 }}
                  />
                  <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                    {resolution.result.quorumMet
                      ? 'Quorum was met'
                      : 'Quorum was not met'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {!resolution.isAnonymous && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vote History
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {resolution.votes.slice(0, 10).map((vote) => (
                    <ListItem key={vote.userId}>
                      <ListItemText
                        primary={vote.userName || 'Anonymous'}
                        secondary={format(new Date(vote.timestamp), 'PPp')}
                      />
                      <Chip
                        label={vote.decision}
                        size="small"
                        color={
                          vote.decision === 'yes'
                            ? 'success'
                            : vote.decision === 'no'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {resolution.votes.length > 10 && (
                  <Typography variant="caption" color="text.secondary">
                    Showing 10 of {resolution.votes.length} votes
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
