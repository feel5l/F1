import { describe, it, expect } from 'vitest';
import { canAccessRoute, ROUTE_ACCESS } from './routeAccess';

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

  it('denies unknown routes', () => {
    expect(canAccessRoute('/unknown', 'ADMIN')).toBe(false);
  });

  it('covers every defined route in ROUTE_ACCESS', () => {
    for (const path of Object.keys(ROUTE_ACCESS)) {
      expect(canAccessRoute(path, 'ADMIN')).toBe(true);
    }
  });
});
