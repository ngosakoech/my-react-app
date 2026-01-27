import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers } from '../../mocks/users.mock';
import type { User } from '../../types';
import { UserRole } from '../../types';
import { format } from 'date-fns';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setDialogMode('add');
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleToggleStatus = async (user: User) => {
    console.log('Toggle status for:', user.id);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      console.log('Delete user:', user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'avatar',
      label: '',
      minWidth: 60,
      sortable: false,
      format: (_, row) => (
        <Avatar src={row.avatar}>
          {row.firstName[0]}
          {row.lastName[0]}
        </Avatar>
      ),
    },
    {
      id: 'firstName',
      label: 'Name',
      minWidth: 200,
      format: (_, row) => (
        <Box>
          <Typography variant="subtitle2">
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      align: 'center',
      format: (value) => (
        <Chip
          label={(value as string).replace('_', ' ')}
          size="small"
          color={
            value === UserRole.ADMIN
              ? 'error'
              : value === UserRole.CHAIRPERSON
              ? 'primary'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      format: (value) => (value as string) || 'N/A',
    },
    {
      id: 'position',
      label: 'Position',
      minWidth: 150,
      format: (value) => (value as string) || 'N/A',
    },
    {
      id: 'isActive',
      label: 'Status',
      align: 'center',
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          size="small"
          color={value ? 'success' : 'default'}
          icon={value ? <CheckCircleIcon /> : <BlockIcon />}
        />
      ),
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      minWidth: 150,
      format: (value) =>
        value ? format(new Date(value as Date), 'PP p') : 'Never',
    },
    {
      id: 'id',
      label: 'Actions',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(row);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
          >
            {row.isActive ? <BlockIcon /> : <CheckCircleIcon />}
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(row);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      color: 'primary.main',
    },
    {
      label: 'Active',
      value: users.filter((u) => u.isActive).length,
      color: 'success.main',
    },
    {
      label: 'Inactive',
      value: users.filter((u) => !u.isActive).length,
      color: 'error.main',
    },
    {
      label: 'Admins',
      value: users.filter((u) => u.role === UserRole.ADMIN).length,
      color: 'warning.main',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (currentUser?.role !== UserRole.ADMIN) {
    return (
      <EmptyState
        title="Access Denied"
        description="You don't have permission to access user management"
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system users and permissions
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>
          Add User
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search users..."
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your filters or add a new user"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>
              Add User
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredUsers}
          rowKey="id"
        />
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                defaultValue={selectedUser?.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                defaultValue={selectedUser?.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedUser?.email}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Role"
                defaultValue={selectedUser?.role || UserRole.BOARD_MEMBER}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                defaultValue={selectedUser?.phone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Department"
                defaultValue={selectedUser?.department}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Position"
                defaultValue={selectedUser?.position}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
