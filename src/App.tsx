import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import { resolveAuthRoute } from './lib/authRouting';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Staff from './pages/Staff';

export default function App() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const loginDecision = resolveAuthRoute('/login', Boolean(user), loading);
  const shellDecision = resolveAuthRoute(pathname, Boolean(user), loading);

  if (loginDecision === 'loading') return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={loginDecision === 'show-login' ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/*"
        element={
          shellDecision === 'show-app' ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/students" element={<Students />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
