import { describe, it, expect } from 'vitest';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  resolveStaffMemberFromAuth,
  shouldBootstrapAdminRole,
} from './authResolution';
import { StaffMember } from '../types';

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('does not bootstrap when a role already exists', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, { role: 'TEACHER' })).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdminRole('other@ghiabi.com', null)).toBe(false);
  });
});

describe('resolveStaffMemberFromAuth', () => {
  const authUser = { email: 'teacher@ghiabi.com', displayName: 'Teacher One' };

  it('prefers roles collection over staff appRole', () => {
    const staffDoc: StaffMember = {
      id: 's1',
      fullName: 'Staff Name',
      nationalId: '123',
      phone: '0500000000',
      role: 'معلم',
      appRole: 'TEACHER',
      specialization: 'math',
      email: 'teacher@ghiabi.com',
    };

    const resolved = resolveStaffMemberFromAuth(authUser, staffDoc, { role: 'ADMIN' });
    expect(resolved?.appRole).toBe('ADMIN');
    expect(resolved?.fullName).toBe('Staff Name');
  });

  it('creates a fallback staff profile when only roles exist', () => {
    const resolved = resolveStaffMemberFromAuth(authUser, null, { role: 'SUPERVISOR' });
    expect(resolved).toEqual({
      fullName: 'Teacher One',
      email: 'teacher@ghiabi.com',
      phone: '',
      role: 'موظف',
      appRole: 'SUPERVISOR',
      specialization: '',
      nationalId: '',
    });
  });

  it('returns null when neither staff nor role data exists', () => {
    expect(resolveStaffMemberFromAuth(authUser, null, null)).toBeNull();
  });
});
