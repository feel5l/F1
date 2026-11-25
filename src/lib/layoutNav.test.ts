import { describe, it, expect } from 'vitest';
import { LAYOUT_NAV_ITEMS, visibleNavPathsForRole } from './layoutNav';

describe('visibleNavPathsForRole', () => {
  it('gives plain teachers dashboard and attendance only among restricted items', () => {
    const paths = visibleNavPathsForRole('TEACHER');
    expect(paths).toContain('/');
    expect(paths).toContain('/attendance');
    expect(paths).not.toContain('/students');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/staff');
  });

  it('gives admin all navigation paths', () => {
    expect(visibleNavPathsForRole('ADMIN').sort()).toEqual(
      LAYOUT_NAV_ITEMS.map((i) => i.path).sort()
    );
  });

  it('allows supervisor staff and reports but not class admin', () => {
    const paths = visibleNavPathsForRole('SUPERVISOR');
    expect(paths).toContain('/staff');
    expect(paths).toContain('/reports');
    expect(paths).not.toContain('/classes');
    expect(paths).not.toContain('/attendance');
  });
});