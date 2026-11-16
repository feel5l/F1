import { describe, it, expect } from 'vitest';
import { APP_ROLES, parseAppRole } from './appRoleParse';

describe('parseAppRole', () => {
  it('accepts known roles with surrounding whitespace', () => {
    expect(parseAppRole(' ADMIN ')).toBe('ADMIN');
    expect(parseAppRole('TEACHER_LEADER')).toBe('TEACHER_LEADER');
  });

  it('rejects empty and unknown role strings', () => {
    expect(parseAppRole('')).toBeUndefined();
    expect(parseAppRole('   ')).toBeUndefined();
    expect(parseAppRole(null)).toBeUndefined();
    expect(parseAppRole('SUPERADMIN')).toBeUndefined();
    expect(parseAppRole('admin')).toBeUndefined();
  });

  it('lists exactly the AppRole union used in Firestore rules', () => {
    expect([...APP_ROLES].sort()).toEqual(
      ['ADMIN', 'ATTENDANCE_OFFICER', 'SUPERVISOR', 'TEACHER', 'TEACHER_LEADER'].sort()
    );
  });
});