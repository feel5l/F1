import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { canAccessRoute } from '../lib/routeAccess';
import { resolveEffectiveRole } from '../lib/permissions';

interface ProtectedRouteProps {
  path: string;
  children: React.ReactNode;
}

/**
 * Guards routes by RBAC — redirects unauthorized users to dashboard.
 */
export default function ProtectedRoute({ path, children }: ProtectedRouteProps) {
  const { isAdmin, staffMember } = useAuth();
  const role = resolveEffectiveRole(staffMember?.appRole, isAdmin);

  if (!canAccessRoute(path, role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
