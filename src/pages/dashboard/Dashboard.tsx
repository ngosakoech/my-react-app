import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import { AdminDashboard } from './AdminDashboard';
import { BoardMemberDashboard } from './BoardMemberDashboard';
import { SubcommitteeDashboard } from './SubcommitteeDashboard';
import { Box, CircularProgress } from '@mui/material';
import { AppLayout } from '../../components/layout/AppLayout';

export const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  switch (user.role) {
    case UserRole.ADMIN:
      return <AdminDashboard />;
    
    case UserRole.BOARD_MEMBER:
    case UserRole.CHAIRPERSON:
    case UserRole.SECRETARY:
      return <BoardMemberDashboard />;
    
    case UserRole.SUBCOMMITTEE_MEMBER:
      return <SubcommitteeDashboard />;
    
    default:
      return <BoardMemberDashboard />;
  }
};

export default Dashboard;
