import { describe, it, expect } from 'vitest';
import { canAccessRoute, getUnauthorizedRedirect, ROUTE_ACCESS } from './routeAccess';
import { resolveEffectiveRole } from './permissions';

describe('canAccessRoute', () => {
  it('allows all authenticated roles to access dashboard', () => {
    expect(canAccessRoute('/', 'TEACHER')).toBe(true);
    expect(canAccessRoute('/', 'ADMIN')).toBe(true);
    expect(canAccessRoute('/', 'SUPERVISOR')).toBe(true);
  });

  it('restricts class management to admin only', () => {
    expect(canAccessRoute('/classes', 'ADMIN')).toBe(true);
    expect(canAccessRoute('/classes', 'TEACHER')).toBe(false);
    expect(canAccessRoute('/classes', 'TEACHER_LEADER')).toBe(false);
  });

  it('allows teacher leader to access students and reports', () => {
    expect(canAccessRoute('/students', 'TEACHER_LEADER')).toBe(true);
    expect(canAccessRoute('/reports', 'TEACHER_LEADER')).toBe(true);
    expect(canAccessRoute('/students', 'TEACHER')).toBe(false);
  });

  it('allows attendance officer to access logs but not staff', () => {
    expect(canAccessRoute('/logs', 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canAccessRoute('/staff', 'ATTENDANCE_OFFICER')).toBe(false);
  });

  it('allows attendance officer to submit attendance but not manage classes', () => {
    expect(canAccessRoute('/attendance', 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canAccessRoute('/classes', 'ATTENDANCE_OFFICER')).toBe(false);
    expect(canAccessRoute('/students', 'ATTENDANCE_OFFICER')).toBe(false);
  });

  it('denies unknown routes', () => {
    expect(canAccessRoute('/unknown', 'ADMIN')).toBe(false);
  });

  it('covers every defined route in ROUTE_ACCESS', () => {
    for (const path of Object.keys(ROUTE_ACCESS)) {
      expect(canAccessRoute(path, 'ADMIN')).toBe(true);
    }
  });
});

describe('getUnauthorizedRedirect', () => {
  it('returns the configured fallback path', () => {
    expect(getUnauthorizedRedirect()).toBe('/');
    expect(getUnauthorizedRedirect('/dashboard')).toBe('/dashboard');
  });
});

/** Mirrors ProtectedRoute: resolveEffectiveRole + canAccessRoute */
describe('effective role route guard', () => {
  it('blocks default teachers from admin-only routes', () => {
    const role = resolveEffectiveRole(undefined, false);
    expect(canAccessRoute('/classes', role)).toBe(false);
    expect(canAccessRoute('/students', role)).toBe(false);
    expect(canAccessRoute('/attendance', role)).toBe(true);
  });

  it('grants full access when legacy isAdmin flag is set without appRole', () => {
    const role = resolveEffectiveRole(undefined, true);
    expect(canAccessRoute('/classes', role)).toBe(true);
    expect(canAccessRoute('/staff', role)).toBe(true);
  });

  it('respects explicit appRole over admin fallback semantics for nav visibility', () => {
    const supervisor = resolveEffectiveRole('SUPERVISOR', false);
    expect(canAccessRoute('/reports', supervisor)).toBe(true);
    expect(canAccessRoute('/classes', supervisor)).toBe(false);
  });
});
