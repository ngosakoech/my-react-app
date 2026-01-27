import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  Stack,
  Divider,
  Paper,
  useTheme,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Business as BusinessIcon,
  Mail as MailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const mockCredentials = [
  { email: 'john.kamau@unitedwinners.co.ke', role: 'Admin (CEO)' },
  { email: 'sarah.wanjiru@unitedwinners.co.ke', role: 'Chairperson' },
  { email: 'peter.omondi@unitedwinners.co.ke', role: 'Secretary' },
  { email: 'grace.muthoni@unitedwinners.co.ke', role: 'Board Member - Finance' },
  { email: 'david.kipchoge@unitedwinners.co.ke', role: 'Board Member - Operations' },
];

export const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading, error: authError, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      clearError();
    }
  }, [authError, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      
      toast.success('Welcome back! Login successful.');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Login failed. Please check your credentials.';
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
            }}
          >
            {/* Left Side - Branding */}
            <Box
              sx={{
                flex: { xs: '0 1 auto', md: '1 1 50%' },
                color: 'white',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <BusinessIcon sx={{ fontSize: 48, mr: 2 }} />
                <Typography variant="h3" fontWeight={700}>
                  United Winners DT
                </Typography>
              </Box>
              
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Board Portal
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 4, opacity: 0.95 }}>
                Secure access to board meetings, documents, and governance tools
              </Typography>

              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">Digital Meeting Management</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">Secure Document Repository</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">Real-time Voting & Resolutions</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{ flex: { xs: '0 1 auto', md: '1 1 50%' }, width: '100%', maxWidth: 480 }}>
              <Card
                elevation={8}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sign in to access the board portal
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                      {errors.root && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          {errors.root.message}
                        </Alert>
                      )}

                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={isSubmitting}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MailIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            disabled={isSubmitting}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                    disabled={isSubmitting}
                                    aria-label="toggle password visibility"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Controller
                          name="rememberMe"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  disabled={isSubmitting}
                                  color="primary"
                                />
                              }
                              label={
                                <Typography variant="body2" color="text.secondary">
                                  Remember me
                                </Typography>
                              }
                            />
                          )}
                        />
                        <Link
                          href="#"
                          variant="body2"
                          underline="hover"
                          sx={{ fontWeight: 500 }}
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info('Password reset feature coming soon!');
                          }}
                        >
                          Forgot password?
                        </Link>
                      </Box>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                      >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </Stack>
                  </form>

                  <Divider sx={{ my: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Test Credentials
                    </Typography>
                  </Divider>

                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'background.default',
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                      Demo Accounts (Password: <strong>password123</strong>)
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockCredentials.map((cred, index) => (
                        <Box key={index}>
                          <Typography variant="caption" color="text.primary" sx={{ fontSize: '0.7rem' }}>
                            {cred.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: '0.65rem' }}>
                            ({cred.role})
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      © 2024 United Winners DT. All rights reserved.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
