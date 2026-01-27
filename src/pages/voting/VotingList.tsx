import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockResolutions } from '../../mocks/resolutions.mock';
import type { Resolution } from '../../types';
import { ResolutionStatus } from '../../types';
import { format, isAfter } from 'date-fns';

export const VotingList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadResolutions = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResolutions(mockResolutions);
      } finally {
        setLoading(false);
      }
    };

    loadResolutions();
  }, []);

  const filteredResolutions = resolutions.filter((resolution) => {
    const matchesSearch =
      resolution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resolution.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || resolution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Resolution>[] = [
    {
      id: 'title',
      label: 'Resolution',
      minWidth: 300,
      format: (_, row) => (
        <Box>
          <Typography variant="subtitle2">{row.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.description.substring(0, 80)}...
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value) => <StatusBadge status={value as ResolutionStatus} />,
    },
    {
      id: 'votingRule',
      label: 'Rule',
      align: 'center',
      format: (value) => (
        <Chip
          label={(value as string).replace('_', ' ')}
          size="small"
          color="primary"
        />
      ),
    },
    {
      id: 'votes',
      label: 'Progress',
      minWidth: 200,
      format: (_, row) => {
        const totalVotes = row.votes.length;
        const yesVotes = row.votes.filter((v) => v.decision === 'yes').length;
        const percentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">
                {totalVotes} votes cast
              </Typography>
              <Typography variant="caption">{percentage.toFixed(0)}% Yes</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={percentage >= 50 ? 'success' : 'warning'}
            />
          </Box>
        );
      },
    },
    {
      id: 'votingDeadline',
      label: 'Deadline',
      minWidth: 150,
      format: (value) => {
        const deadline = new Date(value as Date);
        const isExpired = !isAfter(deadline, new Date());
        return (
          <Box>
            <Typography variant="body2">
              {format(deadline, 'PP')}
            </Typography>
            <Typography
              variant="caption"
              color={isExpired ? 'error.main' : 'text.secondary'}
            >
              {format(deadline, 'p')}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'createdBy',
      label: 'Created By',
      minWidth: 120,
    },
  ];

  const stats = [
    {
      label: 'Active Votes',
      value: resolutions.filter((r) => r.status === ResolutionStatus.ACTIVE).length,
      color: 'primary.main',
    },
    {
      label: 'Pending Vote',
      value: resolutions.filter(
        (r) =>
          r.status === ResolutionStatus.ACTIVE &&
          !r.votes.some((v) => v.userId === 'current-user')
      ).length,
      color: 'warning.main',
    },
    {
      label: 'Closed',
      value: resolutions.filter((r) => r.status === ResolutionStatus.CLOSED).length,
      color: 'success.main',
    },
    {
      label: 'Draft',
      value: resolutions.filter((r) => r.status === ResolutionStatus.DRAFT).length,
      color: 'info.main',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading resolutions..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Voting & Resolutions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and participate in board resolutions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/voting/create')}
        >
          Create Resolution
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search resolutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.values(ResolutionStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredResolutions.length === 0 ? (
        <EmptyState
          icon={VoteIcon}
          title="No resolutions found"
          description="Try adjusting your search or create a new resolution"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/voting/create')}
            >
              Create Resolution
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredResolutions}
          rowKey="id"
          onRowClick={(resolution) => navigate(`/voting/${resolution.id}/results`)}
        />
      )}
    </Box>
  );
};
