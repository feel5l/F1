import { describe, it, expect } from 'vitest';
import { canAccessRoute } from './routeAccess';
import { visibleNavPathsForRole } from './navAccess';

describe('canAccessRoute', () => {
  it('denies teachers deep links to admin-only routes', () => {
    expect(canAccessRoute('/students', 'TEACHER')).toBe(false);
    expect(canAccessRoute('/classes', 'TEACHER')).toBe(false);
    expect(canAccessRoute('/staff', 'TEACHER')).toBe(false);
  });

  it('allows attendance officers attendance and logs but not roster admin', () => {
    expect(canAccessRoute('/attendance', 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canAccessRoute('/logs', 'ATTENDANCE_OFFICER')).toBe(true);
    expect(canAccessRoute('/students', 'ATTENDANCE_OFFICER')).toBe(false);
  });

  it('matches visible nav paths for each role', () => {
    for (const role of [
      'ADMIN',
      'TEACHER',
      'TEACHER_LEADER',
      'ATTENDANCE_OFFICER',
      'SUPERVISOR',
    ] as const) {
      for (const path of visibleNavPathsForRole(role)) {
        expect(canAccessRoute(path, role)).toBe(true);
      }
    }
  });

  it('allows unknown paths without explicit gate (App shell)', () => {
    expect(canAccessRoute('/login', 'TEACHER')).toBe(true);
  });
});