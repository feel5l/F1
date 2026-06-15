import { describe, it, expect } from 'vitest';
import { filterStaff } from './staff';

const staff = [
  {
    id: '1',
    fullName: 'محمد العتيبي',
    nationalId: '1020304050',
    role: 'معلم',
    email: 'm@ghiabi.com',
    phone: '050',
    specialization: 'علوم',
  },
  {
    id: '2',
    fullName: 'سارة الحربي',
    nationalId: '9988776655',
    role: 'مسؤول غياب',
    email: 's@ghiabi.com',
    phone: '051',
    specialization: '',
  },
];

describe('filterStaff', () => {
  it('matches by full name (case-insensitive)', () => {
    expect(filterStaff(staff, 'عتيبي')).toHaveLength(1);
    expect(filterStaff(staff, 'عتيبي')[0].id).toBe('1');
  });

  it('matches by role label', () => {
    expect(filterStaff(staff, 'غياب')).toHaveLength(1);
    expect(filterStaff(staff, 'غياب')[0].id).toBe('2');
  });

  it('matches by national ID exactly', () => {
    expect(filterStaff(staff, '9988776655')).toHaveLength(1);
  });

  it('returns all staff when search is empty', () => {
    expect(filterStaff(staff, '')).toHaveLength(2);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterStaff(staff, 'غير موجود')).toHaveLength(0);
  });
});
