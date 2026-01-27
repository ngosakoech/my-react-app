import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../utils/constants';
import { UserRole } from '../types/auth.types';

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

// Placeholder component for pages not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      This page is under construction. Components need to be created in the pages directory.
    </Typography>
  </Container>
);

// Placeholder pages
const LoginPage = () => <PlaceholderPage title="Login Page" />;
const DashboardPage = () => <PlaceholderPage title="Dashboard" />;
const MeetingListPage = () => <PlaceholderPage title="Meetings" />;
const MeetingDetailPage = () => <PlaceholderPage title="Meeting Details" />;
const MeetingCreatePage = () => <PlaceholderPage title="Create Meeting" />;
const MeetingEditPage = () => <PlaceholderPage title="Edit Meeting" />;
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
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Protected routes - Dashboard */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
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
              <MeetingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_DETAIL}
          element={
            <ProtectedRoute requirePermission="meetings:view">
              <MeetingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_CREATE}
          element={
            <ProtectedRoute requirePermission="meetings:create">
              <MeetingCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MEETINGS_EDIT}
          element={
            <ProtectedRoute requirePermission="meetings:edit">
              <MeetingEditPage />
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
              <DocumentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DOCUMENTS_DETAIL}
          element={
            <ProtectedRoute requirePermission="documents:view">
              <DocumentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DOCUMENTS_UPLOAD}
          element={
            <ProtectedRoute requirePermission="documents:upload">
              <DocumentUploadPage />
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
              <VotingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VOTING_DETAIL}
          element={
            <ProtectedRoute requirePermission="voting:view">
              <VotingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VOTING_CREATE}
          element={
            <ProtectedRoute requirePermission="voting:create">
              <VotingCreatePage />
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
              <LoanListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOANS_DETAIL}
          element={
            <ProtectedRoute requirePermission="loans:view">
              <LoanDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOANS_CREATE}
          element={
            <ProtectedRoute>
              <LoanCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOANS_REVIEW}
          element={
            <ProtectedRoute
              allowedRoles={[
                UserRole.ADMIN,
                UserRole.CHAIRPERSON,
                UserRole.SUBCOMMITTEE_MEMBER,
              ]}
            >
              <LoanReviewPage />
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
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS_DETAIL}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CHAIRPERSON]}>
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS_CREATE}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS_EDIT}
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserEditPage />
            </ProtectedRoute>
          }
        />

        {/* Profile routes */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_EDIT}
          element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE_SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
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
