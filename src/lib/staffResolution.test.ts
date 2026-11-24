import { describe, it, expect } from 'vitest';
import {
  overlayRoleOnStaffMember,
  resolveStaffMemberFromAuthData,
  staffMemberFromRoleOnly,
} from './staffResolution';
import type { StaffMember } from '../types';

const baseStaff: StaffMember = {
  id: 's1',
  fullName: 'معلم',
  email: 't@ghiabi.com',
  phone: '1',
  role: 'معلم',
  appRole: 'TEACHER',
  specialization: 'رياضيات',
  nationalId: '123',
};

describe('overlayRoleOnStaffMember', () => {
  it('overwrites appRole when roles collection has a value', () => {
    expect(overlayRoleOnStaffMember(baseStaff, 'ADMIN').appRole).toBe('ADMIN');
  });

  it('leaves staff unchanged when no role overlay', () => {
    expect(overlayRoleOnStaffMember(baseStaff, undefined)).toBe(baseStaff);
  });
});

describe('resolveStaffMemberFromAuthData', () => {
  it('prefers staff document with role overlay', () => {
    const result = resolveStaffMemberFromAuthData(baseStaff, 'ADMIN', {
      email: 't@ghiabi.com',
    });
    expect(result?.appRole).toBe('ADMIN');
    expect(result?.fullName).toBe('معلم');
  });

  it('builds synthetic staff when only roles entry exists', () => {
    const result = resolveStaffMemberFromAuthData(null, 'SUPERVISOR', {
      email: 's@ghiabi.com',
      displayName: 'مشرف',
    });
    expect(result).toMatchObject({ email: 's@ghiabi.com', appRole: 'SUPERVISOR', fullName: 'مشرف' });
  });

  it('returns null when neither staff nor role exists', () => {
    expect(
      resolveStaffMemberFromAuthData(null, undefined, { email: 'x@ghiabi.com' })
    ).toBeNull();
  });
});

describe('staffMemberFromRoleOnly', () => {
  it('uses default display name when missing', () => {
    const m = staffMemberFromRoleOnly('a@b.com', null, 'TEACHER');
    expect(m.fullName).toBe('مستخدم جديد');
  });
});