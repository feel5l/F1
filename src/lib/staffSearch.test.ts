import { describe, it, expect } from 'vitest';
import { filterStaffMembers } from './staffSearch';
import type { StaffMember } from '../types';

const baseMember: StaffMember = {
  fullName: 'أحمد محمد',
  nationalId: '1234567890',
  phone: '0500000000',
  role: 'معلم',
  specialization: 'رياضيات',
  email: 'ahmad@ghiabi.com',
};

describe('filterStaffMembers', () => {
  it('returns all staff when search is empty or whitespace', () => {
    const list = [baseMember];
    expect(filterStaffMembers(list, '')).toEqual(list);
    expect(filterStaffMembers(list, '   ')).toEqual(list);
  });

  it('matches name and role case-insensitively', () => {
    const list = [baseMember, { ...baseMember, fullName: 'سارة علي', role: 'مشرفة' }];
    expect(filterStaffMembers(list, 'أحمد')).toHaveLength(1);
    expect(filterStaffMembers(list, 'مشرف')).toHaveLength(1);
  });

  it('does not throw when nationalId is missing', () => {
    const legacy = { ...baseMember, nationalId: undefined as unknown as string };
    expect(() => filterStaffMembers([legacy], '1234')).not.toThrow();
    expect(filterStaffMembers([legacy], '1234')).toHaveLength(0);
  });

  it('matches national ID with original casing', () => {
    expect(filterStaffMembers([baseMember], '1234567890')).toHaveLength(1);
  });
});
