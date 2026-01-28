import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../utils/constants';
import { UserRole } from '../types/auth.types';
import { useAuth } from '../contexts/AuthContext';

// Loading component
const LoadingFallback: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="80vh"
    gap={2}
  >
    <CircularProgress size={60} />
    <Typography variant="body1" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

// Lazy load pages for better performance
const Login = lazy(() => import('../pages/auth/Login').then(m => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const BoardMemberDashboard = lazy(() => import('../pages/dashboard/BoardMemberDashboard').then(m => ({ default: m.BoardMemberDashboard })));
const SubcommitteeDashboard = lazy(() => import('../pages/dashboard/SubcommitteeDashboard').then(m => ({ default: m.SubcommitteeDashboard })));
const MeetingList = lazy(() => import('../pages/meetings/MeetingList').then(m => ({ default: m.MeetingList })));
const MeetingDetails = lazy(() => import('../pages/meetings/MeetingDetails').then(m => ({ default: m.MeetingDetails })));
const MeetingPreparation = lazy(() => import('../pages/meetings/MeetingPreparation').then(m => ({ default: m.MeetingPreparation })));
const LoanList = lazy(() => import('../pages/loans/LoanList').then(m => ({ default: m.LoanList })));
const LoanDetails = lazy(() => import('../pages/loans/LoanDetails').then(m => ({ default: m.LoanDetails })));
const LoanAppraisal = lazy(() => import('../pages/loans/LoanAppraisal').then(m => ({ default: m.LoanAppraisal })));
const DocumentLibrary = lazy(() => import('../pages/documents/DocumentLibrary').then(m => ({ default: m.DocumentLibrary })));
const DocumentViewer = lazy(() => import('../pages/documents/DocumentViewer').then(m => ({ default: m.DocumentViewer })));
const VotingList = lazy(() => import('../pages/voting/VotingList').then(m => ({ default: m.VotingList })));
const CreateResolution = lazy(() => import('../pages/voting/CreateResolution').then(m => ({ default: m.CreateResolution })));
const VotingResults = lazy(() => import('../pages/voting/VotingResults').then(m => ({ default: m.VotingResults })));
const AnalyticsDashboard = lazy(() => import('../pages/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const UserManagement = lazy(() => import('../pages/users/UserManagement').then(m => ({ default: m.UserManagement })));

// Role-based dashboard router
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

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

// Pages
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard';
import { MeetingList, MeetingDetails, MeetingForm } from '../pages/meetings';

// Placeholder pages
const DocumentListPage = () => <PlaceholderPage title="Documents" />;
const DocumentDetailPage = () => <PlaceholderPage title="Document Details" />;
const DocumentUploadPage = () => <PlaceholderPage title="Upload Document" />;
const VotingListPage = () => <PlaceholderPage title="Resolutions & Voting" />;
const VotingDetailPage = () => <PlaceholderPage title="Resolution Details" />;
const VotingCreatePage = () => <PlaceholderPage title="Create Resolution" />;
const LoanListPage = () => <PlaceholderPage title="Loan Applications" />;
const LoanDetailPage = () => <PlaceholderPage title="Loan Details" />;
const LoanCreatePage = () => <PlaceholderPage title="Apply for Loan" />;
const LoanReviewPage = () => <PlaceholderPage title="Review Loan" />;
const UserListPage = () => <PlaceholderPage title="Users" />;
const UserDetailPage = () => <PlaceholderPage title="User Details" />;
const UserCreatePage = () => <PlaceholderPage title="Create User" />;
const UserEditPage = () => <PlaceholderPage title="Edit User" />;
const ProfilePage = () => <PlaceholderPage title="My Profile" />;
const ProfileEditPage = () => <PlaceholderPage title="Edit Profile" />;
const SettingsPage = () => <PlaceholderPage title="Settings" />;
const UnauthorizedPage = () => (
  <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom color="error">
      403 - Unauthorized
    </Typography>
    <Typography variant="body1" color="text.secondary">
      You don't have permission to access this page.
    </Typography>
  </Container>
);

const NotFoundPage = () => (
  <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom color="error">
      404 - Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary">
      The page you're looking for doesn't exist.
    </Typography>
  </Container>
);

/**
 * AppRoutes component
 * Defines all application routes with proper authentication and authorization
 */
export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Protected routes - Dashboard */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Meeting routes */}
        <Route
          path={ROUTES.MEETINGS}
          element={
            <ProtectedRoute requirePermission="meetings:view">
              <Navigate to={ROUTES.MEETINGS_LIST} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_LIST}
          element={
            <ProtectedRoute requirePermission="meetings:view">
              <MeetingList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_DETAIL}
          element={
            <ProtectedRoute requirePermission="meetings:view">
              <MeetingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_CREATE}
          element={
            <ProtectedRoute requirePermission="meetings:create">
              <MeetingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:id/prepare"
          element={
            <ProtectedRoute requirePermission="meetings:edit">
              <MeetingForm />
            </ProtectedRoute>
          }
        />

        {/* Document routes */}
        <Route
          path={ROUTES.DOCUMENTS}
          element={
            <ProtectedRoute requirePermission="documents:view">
              <Navigate to={ROUTES.DOCUMENTS_LIST} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DOCUMENTS_LIST}
          element={
            <ProtectedRoute requirePermission="documents:view">
              <DocumentLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DOCUMENTS_DETAIL}
          element={
            <ProtectedRoute requirePermission="documents:view">
              <DocumentViewer />
            </ProtectedRoute>
          }
        />

        {/* Voting routes */}
        <Route
          path={ROUTES.VOTING}
          element={
            <ProtectedRoute requirePermission="voting:view">
              <Navigate to={ROUTES.VOTING_LIST} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VOTING_LIST}
          element={
            <ProtectedRoute requirePermission="voting:view">
              <VotingList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VOTING_DETAIL}
          element={
            <ProtectedRoute requirePermission="voting:view">
              <VotingResults />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VOTING_CREATE}
          element={
            <ProtectedRoute requirePermission="voting:create">
              <CreateResolution />
            </ProtectedRoute>
          }
        />

        {/* Loan routes */}
        <Route
          path={ROUTES.LOANS}
          element={
            <ProtectedRoute requirePermission="loans:view">
              <Navigate to={ROUTES.LOANS_LIST} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOANS_LIST}
          element={
            <ProtectedRoute requirePermission="loans:view">
              <LoanList />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOANS_DETAIL}
          element={
            <ProtectedRoute requirePermission="loans:view">
              <LoanDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:id/appraise"
          element={
            <ProtectedRoute
              allowedRoles={[
                UserRole.ADMIN,
                UserRole.CHAIRPERSON,
                UserRole.SUBCOMMITTEE_MEMBER,
              ]}
            >
              <LoanAppraisal />
            </ProtectedRoute>
          }
        />

        {/* Analytics route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requirePermission="analytics:view">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        {/* User routes - Admin only */}
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CHAIRPERSON]}>
              <Navigate to={ROUTES.USERS_LIST} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS_LIST}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CHAIRPERSON]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Default routes */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Navigate to={ROUTES.DASHBOARD} replace />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found - should be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
