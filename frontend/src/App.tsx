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
import { TestPage } from './pages/test-page';
import { LoginSimple } from './pages/login-simple';
import { LoginDebug } from './pages/login-debug';
import { LoginConsole } from './pages/login-console';
import { LoginBasic } from './pages/login-basic';
import './index.css';
import { AppProvider } from './contexts/app-context';
import { NotificationProvider } from './components/ui/notification';
import { ThemeProvider } from './contexts/theme-context';
import { LanguageProvider } from './contexts/language-context';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients-new" element={<ClientsNew />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services-new" element={<ServicesNew />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/income" element={<Income />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/login-simple" element={<LoginSimple />} />
                <Route path="/login-debug" element={<LoginDebug />} />
                <Route path="/login-console" element={<LoginConsole />} />
                <Route path="/login-basic" element={<LoginBasic />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
