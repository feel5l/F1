import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Attendance.tsx RBAC (class list refresh)', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Attendance.tsx'), 'utf8');

  it('scopes classes via canViewAllClasses and filterClassesForUser', () => {
    expect(source).toMatch(/canViewAllClasses\(isAdmin, staffMember\?\.appRole\)/);
    expect(source).toMatch(/filterClassesForUser/);
  });

  it('refetches classes when staff appRole changes (parity with Reports)', () => {
    expect(source).toMatch(/\}, \[user, isAdmin, staffMember\?\.appRole\]\);/);
  });
});