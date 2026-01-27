import { Box, Typography, Link } from '@mui/material';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {currentYear} United Winners DT Board Portal. All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
        <Link color="inherit" href="/privacy" underline="hover">
          Privacy Policy
        </Link>
        {' | '}
        <Link color="inherit" href="/terms" underline="hover">
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};
