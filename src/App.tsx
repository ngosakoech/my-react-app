import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import lightTheme from './theme/theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { MeetingProvider } from './contexts/MeetingContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { VotingProvider } from './contexts/VotingContext';

// Routes
import { AppRoutes } from './routes/AppRoutes';

// Layout
import { AppLayout } from './components/layout/AppLayout';

/**
 * Main App component
 * Provides global context providers, theme, and routing
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <AuthProvider>
          <MeetingProvider>
            <DocumentProvider>
              <VotingProvider>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </VotingProvider>
            </DocumentProvider>
          </MeetingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
