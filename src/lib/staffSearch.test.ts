import { describe, it, expect } from 'vitest';
import { filterStaffMembers } from './staffSearch';
import { StaffMember } from '../types';

const sample: StaffMember[] = [
  {
    fullName: 'أحمد محمد',
    nationalId: '1016956672',
    phone: '050',
    role: 'معلم',
    specialization: 'رياضيات',
    email: 'a@ghiabi.com',
    appRole: 'TEACHER',
  },
  {
    fullName: 'زياد العتيبي',
    nationalId: '1017303627',
    phone: '051',
    role: 'مدير المدرسة',
    specialization: 'إدارة',
    email: 'b@ghiabi.com',
    appRole: 'ADMIN',
  },
];

describe('filterStaffMembers', () => {
  it('returns all staff when search is empty or whitespace', () => {
    expect(filterStaffMembers(sample, '')).toHaveLength(2);
    expect(filterStaffMembers(sample, '   ')).toHaveLength(2);
  });

  it('matches by full name case-insensitively', () => {
    expect(filterStaffMembers(sample, 'أحمد')).toHaveLength(1);
    expect(filterStaffMembers(sample, 'عتيبي')).toHaveLength(1);
  });

  it('matches by display role', () => {
    expect(filterStaffMembers(sample, 'مدير')).toHaveLength(1);
  });

  it('matches national ID without lowercasing digits', () => {
    expect(filterStaffMembers(sample, '1017303627')).toHaveLength(1);
  });

  it('does not throw when nationalId is missing on legacy records', () => {
    const legacy: StaffMember[] = [
      {
        fullName: 'موظف قديم',
        nationalId: undefined as unknown as string,
        phone: '',
        role: 'موظف',
        specialization: '',
        email: 'legacy@ghiabi.com',
      },
    ];
    expect(() => filterStaffMembers(legacy, 'موظف')).not.toThrow();
    expect(filterStaffMembers(legacy, 'موظف')).toHaveLength(1);
    expect(filterStaffMembers(legacy, '999')).toHaveLength(0);
  });
});
