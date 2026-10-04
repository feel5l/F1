import { describe, it, expect } from 'vitest';
import {
  buildStaffRoleUpdate,
  buildRolesCollectionUpdate,
  canUpdateStaffRole,
} from './staffRoles';

describe('buildStaffRoleUpdate', () => {
  it('wraps the new role in appRole field', () => {
    expect(buildStaffRoleUpdate('SUPERVISOR')).toEqual({ appRole: 'SUPERVISOR' });
  });
});

describe('buildRolesCollectionUpdate', () => {
  it('includes role and updatedAt timestamp', () => {
    const date = new Date('2026-03-15T10:00:00Z');
    expect(buildRolesCollectionUpdate('ADMIN', date)).toEqual({
      role: 'ADMIN',
      updatedAt: date,
    });
  });
});

describe('canUpdateStaffRole', () => {
  it('requires both email and role', () => {
    expect(canUpdateStaffRole('a@ghiabi.com', 'TEACHER')).toBe(true);
    expect(canUpdateStaffRole(undefined, 'TEACHER')).toBe(false);
    expect(canUpdateStaffRole('a@ghiabi.com', '')).toBe(false);
  });
});
