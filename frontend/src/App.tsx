import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LandingSimple } from './pages/landing-simple';
import { Dashboard } from './pages/dashboard';
import { Agenda } from './pages/agenda';
import { Analytics } from './pages/analytics';
import { Clients } from './pages/clients';
import { Services } from './pages/services';
import { Staff } from './pages/staff';
import { Income } from './pages/income';
import { Expenses } from './pages/expenses';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { AuthCallback } from './pages/auth-callback';
import { WhatsAppIntegration } from './pages/whatsapp';
import { Debug } from './pages/debug';
import { ProtectedRoute } from './components/auth/protected-route';
import { AppProvider } from './contexts/app-context';
import { NotificationProvider } from './components/ui/notification';
import { ThemeProvider } from './contexts/theme-context';
import { LanguageProvider } from './contexts/language-context';
import { AuthProvider } from './contexts/auth-context';
import { ErrorBoundary } from './components/ui/error-boundary';
import { queryClient } from './lib/query-client';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <AppProvider>
                  <NotificationProvider>
                  <Router>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/debug" element={<Debug />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected Routes */}
                    <Route path="/agenda" element={
                      <ProtectedRoute>
                        <Agenda />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                      <ProtectedRoute>
                        <Clients />
                      </ProtectedRoute>
                    } />
                    <Route path="/services" element={
                      <ProtectedRoute>
                        <Services />
                      </ProtectedRoute>
                    } />
                    <Route path="/staff" element={
                      <ProtectedRoute>
                        <Staff />
                      </ProtectedRoute>
                    } />
                    <Route path="/income" element={
                      <ProtectedRoute>
                        <Income />
                      </ProtectedRoute>
                    } />
                    <Route path="/expenses" element={
                      <ProtectedRoute>
                        <Expenses />
                      </ProtectedRoute>
                    } />
                    <Route path="/whatsapp" element={
                      <ProtectedRoute>
                        <WhatsAppIntegration />
                      </ProtectedRoute>
                    } />
                    {/* Ruta de fallback */}
                    <Route path="*" element={<Navigate to="/agenda" replace />} />
                  </Routes>
                </Router>

                  {/* Toaster de Sonner */}
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    expand={true}
                    duration={4000}
                  />
                </NotificationProvider>
              </AppProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>

        {/* React Query Devtools - solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
