import { describe, it, expect } from 'vitest';
import { resolveStaffMemberFromAuth } from './authResolution';
import { StaffMember } from '../types';

const baseStaff: StaffMember = {
  id: 's1',
  fullName: 'Test Teacher',
  nationalId: '123',
  phone: '050',
  role: 'معلم',
  appRole: 'TEACHER',
  specialization: 'Math',
  email: 'teacher@ghiabi.com',
};

describe('resolveStaffMemberFromAuth', () => {
  it('merges staff record with roles collection when both exist', () => {
    const result = resolveStaffMemberFromAuth(baseStaff, { role: 'ADMIN' }, 'teacher@ghiabi.com');
    expect(result?.appRole).toBe('ADMIN');
    expect(result?.fullName).toBe('Test Teacher');
  });

  it('creates fallback staff when only roles collection has data', () => {
    const result = resolveStaffMemberFromAuth(null, { role: 'SUPERVISOR' }, 'new@ghiabi.com', 'New User');
    expect(result).toMatchObject({
      fullName: 'New User',
      email: 'new@ghiabi.com',
      appRole: 'SUPERVISOR',
    });
  });

  it('returns null when neither staff nor role data exists', () => {
    expect(resolveStaffMemberFromAuth(null, null, 'unknown@ghiabi.com')).toBeNull();
    expect(resolveStaffMemberFromAuth(null, {}, 'unknown@ghiabi.com')).toBeNull();
  });

  it('prefers staff record over role-only fallback', () => {
    const result = resolveStaffMemberFromAuth(baseStaff, null, 'teacher@ghiabi.com');
    expect(result).toEqual(baseStaff);
  });
});
