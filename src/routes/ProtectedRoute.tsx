import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { ROUTES, ROLE_PERMISSIONS } from '../utils/constants';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requirePermission?: string;
}

/**
 * ProtectedRoute component
 * Protects routes that require authentication and/or specific roles
 * 
 * @param children - The component to render if authorized
 * @param allowedRoles - Array of roles allowed to access this route
 * @param requirePermission - Specific permission required to access this route
 * 
 * @example
 * // Only authenticated users
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Only admin and chairperson
 * <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CHAIRPERSON]}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * // Require specific permission
 * <ProtectedRoute requirePermission="meetings:create">
 *   <CreateMeeting />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requirePermission,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  // Check permission-based access
  if (requirePermission) {
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const permissionsArray = [...userPermissions] as string[];
    const hasPermission =
      permissionsArray.includes('all') || // Admin has all permissions
      permissionsArray.includes(requirePermission);

    if (!hasPermission) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  // User is authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
