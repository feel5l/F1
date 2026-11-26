import { describe, it, expect } from 'vitest';
import { canUpdateStaffRole } from './staffRoleUpdate';

describe('canUpdateStaffRole', () => {
  it('allows update when member id and role are present', () => {
    expect(canUpdateStaffRole({ id: 'staff-1' }, 'TEACHER')).toBe(true);
  });

  it('blocks update without staff id or role', () => {
    expect(canUpdateStaffRole({ id: 'staff-1' }, '')).toBe(false);
    expect(canUpdateStaffRole({ id: 'staff-1' }, undefined)).toBe(false);
    expect(canUpdateStaffRole(null, 'ADMIN')).toBe(false);
    expect(canUpdateStaffRole({}, 'ADMIN')).toBe(false);
  });
});