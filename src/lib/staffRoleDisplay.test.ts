import { describe, it, expect } from 'vitest';
import { resolveStaffRoleBadgeMeta } from './staffRoleDisplay';

describe('resolveStaffRoleBadgeMeta', () => {
  it('maps known roles to Arabic labels', () => {
    expect(resolveStaffRoleBadgeMeta('ADMIN').label).toBe('مدير نظام');
    expect(resolveStaffRoleBadgeMeta('ATTENDANCE_OFFICER').label).toBe('مسؤول غياب');
  });

  it('falls back to outline badge for missing role', () => {
    expect(resolveStaffRoleBadgeMeta(undefined)).toEqual({
      label: 'غير محدد',
      variant: 'outline',
    });
  });
});