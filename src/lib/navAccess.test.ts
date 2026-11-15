import { describe, it, expect } from 'vitest';
import { NAV_ROUTE_ACCESS, visibleNavPathsForRole } from './navAccess';

const allPaths = NAV_ROUTE_ACCESS.map((route) => route.path);

describe('visibleNavPathsForRole', () => {
  it('grants admins every navigation destination', () => {
    expect(visibleNavPathsForRole('ADMIN').sort()).toEqual([...allPaths].sort());
  });

  it('limits teachers to dashboard and daily attendance only', () => {
    expect(visibleNavPathsForRole('TEACHER')).toEqual(['/', '/attendance']);
  });

  it('allows attendance officers to reach logs but not class administration', () => {
    const paths = visibleNavPathsForRole('ATTENDANCE_OFFICER');
    expect(paths).toContain('/');
    expect(paths).toContain('/attendance');
    expect(paths).toContain('/logs');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/students');
  });

  it('exposes reports to supervisors but hides staff roster from teachers', () => {
    expect(visibleNavPathsForRole('SUPERVISOR')).toContain('/reports');
    expect(visibleNavPathsForRole('SUPERVISOR')).toContain('/staff');
    expect(visibleNavPathsForRole('TEACHER')).not.toContain('/reports');
    expect(visibleNavPathsForRole('TEACHER')).not.toContain('/staff');
  });

  it('lets teacher leaders manage students and reports without admin-only screens', () => {
    const paths = visibleNavPathsForRole('TEACHER_LEADER');
    expect(paths).toContain('/students');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/staff');
  });
});