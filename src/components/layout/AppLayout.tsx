import { useState, type ReactNode } from 'react';
import { Box, Container, Toolbar, Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Don't show layout on login page or when not authenticated
  const isLoginPage = location.pathname === '/login';
  const showLayout = isAuthenticated && !isLoginPage;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    if (pathnames.length === 0 || pathnames[0] === 'dashboard') {
      return null;
    }

    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/dashboard"
          color="inherit"
          underline="hover"
        >
          Dashboard
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return isLast ? (
            <Typography color="text.primary" key={to}>
              {label}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              color="inherit"
              underline="hover"
              key={to}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  // If not showing layout, just render children
  if (!showLayout) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header onMenuClick={handleDrawerToggle} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar 
          open={mobileOpen} 
          onClose={handleDrawerToggle}
          userRole={user?.role}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', md: `calc(100% - 240px)` },
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
            {generateBreadcrumbs()}
            {children}
          </Container>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};
