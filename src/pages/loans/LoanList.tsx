import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockLoans } from '../../mocks/loans.mock';
import type { LoanApplication } from '../../types';
import { LoanType, LoanStatus, LoanUrgency } from '../../types';
import { format } from 'date-fns';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const LoanList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  useEffect(() => {
    const loadLoans = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLoans(mockLoans);
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || loan.loanType === typeFilter;
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || loan.urgency === urgencyFilter;
    return matchesSearch && matchesType && matchesStatus && matchesUrgency;
  });

  const columns: Column<LoanApplication>[] = [
    {
      id: 'id',
      label: 'Loan ID',
      minWidth: 120,
    },
    {
      id: 'applicantName',
      label: 'Applicant',
      minWidth: 200,
      format: (_, row) => (
        <Box>
          <Typography variant="subtitle2">{row.applicantName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {row.applicantEmail}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'loanType',
      label: 'Type',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={
            value === LoanType.EMERGENCY
              ? 'error'
              : value === LoanType.BUSINESS
              ? 'primary'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      align: 'right',
      format: (value) => `KSH ${(value as number).toLocaleString()}`,
    },
    {
      id: 'term',
      label: 'Term',
      align: 'center',
      format: (value) => `${value} months`,
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value) => <StatusBadge status={value as LoanStatus} />,
    },
    {
      id: 'urgency',
      label: 'Urgency',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={
            value === LoanUrgency.CRITICAL
              ? 'error'
              : value === LoanUrgency.HIGH
              ? 'warning'
              : value === LoanUrgency.MEDIUM
              ? 'info'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'submittedDate',
      label: 'Submitted',
      minWidth: 120,
      format: (value) => format(new Date(value as Date), 'PP'),
    },
  ];

  const stats = [
    {
      label: 'Total Applications',
      value: loans.length,
      color: 'primary.main',
    },
    {
      label: 'Under Review',
      value: loans.filter((l) => l.status === LoanStatus.UNDER_REVIEW).length,
      color: 'warning.main',
    },
    {
      label: 'Approved',
      value: loans.filter((l) => l.status === LoanStatus.APPROVED).length,
      color: 'success.main',
    },
    {
      label: 'Total Amount',
      value: `KSH ${(
        loans
          .filter((l) => l.status === LoanStatus.APPROVED)
          .reduce((sum, l) => sum + l.amount, 0) / 1000000
      ).toFixed(1)}M`,
      color: 'info.main',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading loan applications..." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Loan Applications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and review loan applications
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
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
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search loans..."
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
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {Object.values(LoanType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.values(LoanStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Urgency"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <MenuItem value="all">All Urgencies</MenuItem>
                {Object.values(LoanUrgency).map((urgency) => (
                  <MenuItem key={urgency} value={urgency}>
                    {urgency}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredLoans.length === 0 ? (
        <EmptyState
          icon={AssignmentIcon}
          title="No loan applications found"
          description="Try adjusting your filters to see more results"
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredLoans}
          rowKey="id"
          onRowClick={(loan) => navigate(`/loans/${loan.id}`)}
        />
      )}
    </Box>
  );
};
