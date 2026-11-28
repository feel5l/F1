import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Dashboard.tsx teacher scope', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Dashboard.tsx'), 'utf8');

  it('limits non-admin student counts to classes assigned by teacherEmail', () => {
    expect(source).toMatch(/where\('teacherEmail', '==', user\?\.email\)/);
    expect(source).toMatch(/where\('classId', 'in', classIds\)/);
  });

  it('scopes today logs for teachers by teacherEmail', () => {
    expect(source).toMatch(/where\('teacherEmail', '==', user\.email\)/);
  });
});