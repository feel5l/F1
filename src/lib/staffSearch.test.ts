import { describe, it, expect } from 'vitest';
import { filterStaffMembers } from './staffSearch';
import type { StaffMember } from '../types';

const baseMember: StaffMember = {
  fullName: 'أحمد محمد',
  nationalId: '1020304050',
  phone: '0500000000',
  role: 'معلم',
  appRole: 'TEACHER',
  specialization: 'رياضيات',
  email: 'teacher@ghiabi.com',
};

describe('filterStaffMembers', () => {
  it('returns all staff when search is empty', () => {
    expect(filterStaffMembers([baseMember], '')).toHaveLength(1);
    expect(filterStaffMembers([baseMember], '   ')).toHaveLength(1);
  });

  it('matches name and role case-insensitively', () => {
    const members = [
      baseMember,
      { ...baseMember, fullName: 'سارة علي', role: 'إداري', email: 'sara@ghiabi.com' },
    ];
    expect(filterStaffMembers(members, 'أحمد')).toHaveLength(1);
    expect(filterStaffMembers(members, 'إدار')).toHaveLength(1);
  });

  it('matches national ID without throwing when nationalId is missing', () => {
    const legacy = { ...baseMember, nationalId: undefined as unknown as string };
    expect(() => filterStaffMembers([legacy, baseMember], '1020')).not.toThrow();
    expect(filterStaffMembers([legacy, baseMember], '1020')).toHaveLength(1);
  });
});
