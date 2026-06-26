import { describe, it, expect } from 'vitest';
import {
  normalizeGhiabiEmail,
  resolveRoleFlags,
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  BOOTSTRAP_ADMIN_EMAIL,
} from './auth-helpers';
import { StaffMember } from '../types';

describe('normalizeGhiabiEmail', () => {
  it('appends @ghiabi.com when input has no @', () => {
    expect(normalizeGhiabiEmail('zayd12345')).toBe('zayd12345@ghiabi.com');
  });

  it('keeps full email unchanged', () => {
    expect(normalizeGhiabiEmail('user@ghiabi.com')).toBe('user@ghiabi.com');
  });

  it('trims whitespace before normalization', () => {
    expect(normalizeGhiabiEmail('  zayd12345  ')).toBe('zayd12345@ghiabi.com');
  });
});

describe('resolveRoleFlags', () => {
  it('marks ADMIN as admin only', () => {
    expect(resolveRoleFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('marks TEACHER_LEADER as teacher', () => {
    expect(resolveRoleFlags('TEACHER_LEADER')).toEqual({
      isAdmin: false,
      isTeacher: true,
      isSupervisor: false,
    });
  });

  it('marks SUPERVISOR without teacher privileges', () => {
    expect(resolveRoleFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });

  it('returns all false when role is undefined', () => {
    expect(resolveRoleFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});

describe('shouldBootstrapAdmin', () => {
  it('returns true for bootstrap email without existing role', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, {})).toBe(true);
  });

  it('returns false when role already exists', () => {
    expect(shouldBootstrapAdmin(BOOTSTRAP_ADMIN_EMAIL, { role: 'ADMIN' })).toBe(false);
  });

  it('returns false for other emails', () => {
    expect(shouldBootstrapAdmin('other@ghiabi.com', null)).toBe(false);
  });
});

describe('mergeStaffWithRole', () => {
  const staffDoc: StaffMember = {
    id: 'staff-1',
    fullName: 'أحمد',
    nationalId: '123',
    email: 'ahmad@ghiabi.com',
    phone: '0500000000',
    role: 'معلم',
    appRole: 'TEACHER',
    specialization: 'رياضيات',
  };

  it('overwrites appRole from roles collection when staff exists', () => {
    const merged = mergeStaffWithRole('ahmad@ghiabi.com', 'أحمد', staffDoc, { role: 'ADMIN' });
    expect(merged?.appRole).toBe('ADMIN');
    expect(merged?.fullName).toBe('أحمد');
  });

  it('creates fallback staff member from roles only', () => {
    const merged = mergeStaffWithRole('new@ghiabi.com', 'مستخدم', null, { role: 'TEACHER' });
    expect(merged).toEqual({
      fullName: 'مستخدم',
      email: 'new@ghiabi.com',
      nationalId: '',
      phone: '',
      role: 'موظف',
      appRole: 'TEACHER',
      specialization: '',
    });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(mergeStaffWithRole('unknown@ghiabi.com', null, null, null)).toBeNull();
  });
});
