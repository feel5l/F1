import { describe, it, expect } from 'vitest';
import {
  mergeStaffWithRoleDoc,
  buildStaffFallbackFromRole,
  resolveStaffMemberAfterAuth,
} from './authStaffMerge';
import type { StaffMember } from '../types';

const baseStaff: StaffMember = {
  id: 'st1',
  fullName: 'معلم',
  nationalId: '1',
  phone: '05',
  role: 'معلم',
  appRole: 'TEACHER',
  specialization: 'رياضيات',
  email: 't@school.com',
};

describe('mergeStaffWithRoleDoc', () => {
  it('overrides appRole when roles document has role', () => {
    expect(mergeStaffWithRoleDoc(baseStaff, { role: 'ADMIN' }).appRole).toBe('ADMIN');
  });

  it('keeps staff when roles doc is empty', () => {
    expect(mergeStaffWithRoleDoc(baseStaff, null).appRole).toBe('TEACHER');
  });
});

describe('resolveStaffMemberAfterAuth', () => {
  it('returns merged staff when staff doc exists', () => {
    const resolved = resolveStaffMemberAfterAuth(baseStaff, { role: 'SUPERVISOR' }, 't@school.com', 'X');
    expect(resolved?.appRole).toBe('SUPERVISOR');
    expect(resolved?.fullName).toBe('معلم');
  });

  it('builds fallback staff from roles only', () => {
    const resolved = resolveStaffMemberAfterAuth(null, { role: 'ATTENDANCE_OFFICER' }, 'a@school.com', null);
    expect(resolved?.appRole).toBe('ATTENDANCE_OFFICER');
    expect(resolved?.fullName).toBe('مستخدم جديد');
  });

  it('returns null when neither staff nor role exists', () => {
    expect(resolveStaffMemberAfterAuth(null, null, 'x@school.com', 'X')).toBeNull();
  });
});

describe('buildStaffFallbackFromRole', () => {
  it('uses display name when provided', () => {
    expect(buildStaffFallbackFromRole('e@x.com', 'علي', 'TEACHER').fullName).toBe('علي');
  });
});