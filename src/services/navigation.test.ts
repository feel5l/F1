import { describe, it, expect } from 'vitest';
import {
  NAV_ITEMS,
  filterNavItemsForRole,
  getRoleLabel,
  resolveEffectiveRole,
} from './navigation';

describe('resolveEffectiveRole', () => {
  it('prefers explicit appRole over isAdmin fallback', () => {
    expect(resolveEffectiveRole('TEACHER', true)).toBe('TEACHER');
  });

  it('falls back to ADMIN when isAdmin and no appRole', () => {
    expect(resolveEffectiveRole(undefined, true)).toBe('ADMIN');
  });

  it('falls back to TEACHER when no appRole and not admin', () => {
    expect(resolveEffectiveRole(undefined, false)).toBe('TEACHER');
  });
});

describe('filterNavItemsForRole', () => {
  it('shows all nav paths for ADMIN', () => {
    const paths = filterNavItemsForRole('ADMIN').map((i) => i.path);
    expect(paths).toEqual(NAV_ITEMS.map((i) => i.path));
  });

  it('limits plain TEACHER to dashboard and attendance only', () => {
    const paths = filterNavItemsForRole('TEACHER').map((i) => i.path);
    expect(paths).toEqual(['/', '/attendance']);
  });

  it('allows SUPERVISOR staff and reports but not class management', () => {
    const paths = filterNavItemsForRole('SUPERVISOR').map((i) => i.path);
    expect(paths).toContain('/staff');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/attendance');
  });

  it('allows ATTENDANCE_OFFICER logs and attendance but not students', () => {
    const paths = filterNavItemsForRole('ATTENDANCE_OFFICER').map((i) => i.path);
    expect(paths).toContain('/logs');
    expect(paths).toContain('/attendance');
    expect(paths).not.toContain('/students');
  });
});

describe('getRoleLabel', () => {
  it('returns Arabic labels for known roles', () => {
    expect(getRoleLabel('ADMIN')).toBe('مدير نظام');
    expect(getRoleLabel('TEACHER')).toBe('معلم');
    expect(getRoleLabel('ATTENDANCE_OFFICER')).toBe('مسؤول غياب');
  });

  it('returns generic label for unknown roles', () => {
    expect(getRoleLabel('UNKNOWN')).toBe('موظف');
  });
});
