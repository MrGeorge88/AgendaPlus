import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/landing';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { TestPage } from './pages/test-page';
import { LoginSimple } from './pages/login-simple';
import { LoginBasic } from './pages/login-basic';
import { LoginTailwind } from './pages/login-tailwind';
import { LoginInline } from './pages/login-inline';
import './tailwind.css';

function AppSimple() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/login-simple" element={<LoginSimple />} />
        <Route path="/login-basic" element={<LoginBasic />} />
        <Route path="/login-tailwind" element={<LoginTailwind />} />
        <Route path="/login-inline" element={<LoginInline />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppSimple;
