import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

  it('accepts every appRole whitelisted in firestore.rules staff validation', () => {
    const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
    const match = rules.match(/data\.appRole in \[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const rolesInRules = [...match![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    for (const role of rolesInRules) {
      expect(parseAppRole(role)).toBe(role);
    }
  });
});