import { describe, it, expect } from 'vitest';
import {
  applyRoleToStaffMember,
  buildStaffMemberFromRoleOnly,
  resolveStaffMemberFromQueries,
} from './authStaff';
import { StaffMember } from '../types';

const baseStaff: StaffMember = {
  id: 's1',
  fullName: 'معلم',
  email: 'teacher@ghiabi.com',
  phone: '050',
  role: 'معلم',
  appRole: 'TEACHER',
  specialization: 'رياضيات',
  nationalId: '123',
};

describe('applyRoleToStaffMember', () => {
  it('overwrites appRole when roles collection has a value', () => {
    expect(applyRoleToStaffMember(baseStaff, { role: 'TEACHER_LEADER' }).appRole).toBe(
      'TEACHER_LEADER'
    );
  });

  it('keeps staff document when roles collection is empty', () => {
    expect(applyRoleToStaffMember(baseStaff, null)).toEqual(baseStaff);
  });
});

describe('buildStaffMemberFromRoleOnly', () => {
  it('builds a minimal profile from roles collection', () => {
    expect(
      buildStaffMemberFromRoleOnly('new@ghiabi.com', 'New User', { role: 'SUPERVISOR' })
    ).toMatchObject({
      email: 'new@ghiabi.com',
      fullName: 'New User',
      appRole: 'SUPERVISOR',
    });
  });

  it('returns null when no role document exists', () => {
    expect(buildStaffMemberFromRoleOnly('x@ghiabi.com', null, null)).toBeNull();
  });
});

describe('resolveStaffMemberFromQueries', () => {
  it('prefers staff document with role overlay', () => {
    const resolved = resolveStaffMemberFromQueries(
      baseStaff,
      'teacher@ghiabi.com',
      'Teacher',
      { role: 'ADMIN' }
    );
    expect(resolved?.appRole).toBe('ADMIN');
    expect(resolved?.fullName).toBe('معلم');
  });

  it('falls back to roles-only profile when staff query is empty', () => {
    const resolved = resolveStaffMemberFromQueries(
      null,
      'officer@ghiabi.com',
      null,
      { role: 'ATTENDANCE_OFFICER' }
    );
    expect(resolved?.appRole).toBe('ATTENDANCE_OFFICER');
    expect(resolved?.fullName).toBe('مستخدم جديد');
  });

  it('returns null when neither staff nor role exists', () => {
    expect(resolveStaffMemberFromQueries(null, 'x@ghiabi.com', null, null)).toBeNull();
  });
});
