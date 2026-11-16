import { describe, it, expect } from 'vitest';
import { parseAppRole } from './appRoleParse';

describe('parseAppRole', () => {
  it('accepts whitelisted roles', () => {
    expect(parseAppRole('ADMIN')).toBe('ADMIN');
    expect(parseAppRole('TEACHER_LEADER')).toBe('TEACHER_LEADER');
  });

  it('trims whitespace', () => {
    expect(parseAppRole('  SUPERVISOR  ')).toBe('SUPERVISOR');
  });

  it('rejects invalid or empty values', () => {
    expect(parseAppRole('SUPERADMIN')).toBeUndefined();
    expect(parseAppRole('')).toBeUndefined();
    expect(parseAppRole('   ')).toBeUndefined();
    expect(parseAppRole(undefined)).toBeUndefined();
    expect(parseAppRole(null)).toBeUndefined();
  });
});