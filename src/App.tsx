import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/*"
        element={
          user ? (
            <Layout>
              <Routes>
                <Route path="/" element={<ProtectedRoute path="/"><Dashboard /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute path="/attendance"><Attendance /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute path="/students"><Students /></ProtectedRoute>} />
                <Route path="/classes" element={<ProtectedRoute path="/classes"><Classes /></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute path="/staff"><Staff /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute path="/logs"><Logs /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute path="/reports"><Reports /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
