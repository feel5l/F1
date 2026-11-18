import type { AppRole } from '../types';
import { NAV_ROUTE_ACCESS } from './navAccess';
import { isRoleAllowedForNav } from './roleAccess';

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** Whether the given role may open this app route (aligned with sidebar gates). */
export function canAccessRoute(pathname: string, role: AppRole | string): boolean {
  const path = normalizePath(pathname);
  const entry = NAV_ROUTE_ACCESS.find((route) => route.path === path);
  if (!entry) return true;
  return isRoleAllowedForNav(role, entry.roles);
}