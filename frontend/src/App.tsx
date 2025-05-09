import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/landing';
import { Dashboard } from './pages/dashboard';
import { Clients } from './pages/clients';
import { Services } from './pages/services';
import { Staff } from './pages/staff';
import { Income } from './pages/income';
import { Clients as ClientsNew } from './pages/clients-new';
import { Services as ServicesNew } from './pages/services-new';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { AuthCallback } from './pages/auth-callback';
import { ProtectedRoute } from './components/auth/protected-route';
import { TestPage } from './pages/test-page';
import { LoginSimple } from './pages/login-simple';
import { LoginDebug } from './pages/login-debug';
import { LoginConsole } from './pages/login-console';
import { LoginBasic } from './pages/login-basic';
import { LoginTest } from './pages/login-test';
import './index.css';
import { AppProvider } from './contexts/app-context';
import { NotificationProvider } from './components/ui/notification';
import { ThemeProvider } from './contexts/theme-context';
import { LanguageProvider } from './contexts/language-context';
import { AuthProvider } from './contexts/auth-context';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients-new" element={
                    <ProtectedRoute>
                      <ClientsNew />
                    </ProtectedRoute>
                  } />
                  <Route path="/services" element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  } />
                  <Route path="/services-new" element={
                    <ProtectedRoute>
                      <ServicesNew />
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
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/login-simple" element={<LoginSimple />} />
                  <Route path="/login-debug" element={<LoginDebug />} />
                  <Route path="/login-console" element={<LoginConsole />} />
                  <Route path="/login-basic" element={<LoginBasic />} />
                  <Route path="/login-test" element={<LoginTest />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
