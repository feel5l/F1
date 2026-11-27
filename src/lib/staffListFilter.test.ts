import { describe, it, expect } from 'vitest';
import { filterStaffList, matchesStaffSearch } from './staffListFilter';
import type { StaffMember } from '../types';

const sample: StaffMember[] = [
  {
    fullName: 'أحمد علي',
    nationalId: '1234567890',
    role: 'معلم رياضيات',
    appRole: 'TEACHER',
    email: 'ahmed@ghiabi.com',
    phone: '0500000001',
    specialization: 'رياضيات',
  },
  {
    fullName: 'سارة محمد',
    nationalId: '0987654321',
    role: 'مديرة',
    appRole: 'ADMIN',
    email: 'sara@ghiabi.com',
    phone: '0500000002',
    specialization: 'إدارة',
  },
];

describe('matchesStaffSearch', () => {
  it('matches name, job title, or national ID', () => {
    expect(matchesStaffSearch(sample[0], 'أحمد')).toBe(true);
    expect(matchesStaffSearch(sample[0], 'رياضيات')).toBe(true);
    expect(matchesStaffSearch(sample[0], '1234567890')).toBe(true);
    expect(matchesStaffSearch(sample[0], 'nomatch')).toBe(false);
  });
});

describe('filterStaffList', () => {
  it('returns all staff when search is empty', () => {
    expect(filterStaffList(sample, '')).toHaveLength(2);
  });

  it('narrows list by partial national ID', () => {
    expect(filterStaffList(sample, '0987654')).toEqual([sample[1]]);
  });
});