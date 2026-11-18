import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { BOOTSTRAP_ADMIN_EMAIL } from './roleAccess';

const rulesPath = resolve(__dirname, '../../firestore.rules');

function readRules(): string {
  return readFileSync(rulesPath, 'utf8');
}

function extractQuotedRoles(rulesFragment: string): string[] {
  return [...rulesFragment.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe('firestore.rules parity (client constants)', () => {
  const rules = readRules();

  it('uses the same bootstrap admin email as roleAccess', () => {
    expect(rules).toContain(`'${BOOTSTRAP_ADMIN_EMAIL}'`);
  });

  it('keeps staff appRole whitelist aligned with appRoleParse', () => {
    const match = rules.match(/data\.appRole in \[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const fromRules = extractQuotedRoles(match![1]).sort();
    const expected = [
      'ADMIN',
      'ATTENDANCE_OFFICER',
      'SUPERVISOR',
      'TEACHER',
      'TEACHER_LEADER',
    ].sort();
    expect(fromRules).toEqual(expected);
  });

  it('documents bootstrap roles create contract used by adminBootstrapRole', () => {
    expect(rules).toMatch(/hasOnly\(\['role'\]\)/);
    expect(rules).toMatch(/incoming\(\)\.role == 'ADMIN'/);
    expect(rules).toMatch(/roleEmail == request\.auth\.token\.email/);
  });
});