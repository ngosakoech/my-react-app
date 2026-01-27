import { useState, type ReactNode } from 'react';
import { Box, Container, Toolbar, Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { UserRole } from '../../types/auth.types';

interface AppLayoutProps {
  children: ReactNode;
  userRole?: UserRole;
  notificationCount?: number;
}

export const AppLayout = ({ 
  children, 
  userRole = UserRole.BOARD_MEMBER,
  notificationCount = 0 
}: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header onMenuClick={handleDrawerToggle} notificationCount={notificationCount} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar 
          open={mobileOpen} 
          onClose={handleDrawerToggle}
          userRole={userRole}
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
