import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { BOOTSTRAP_ADMIN_EMAIL } from './roleAccess';

/** Client bootstrap and Firestore rules must agree on the admin seed email. */
describe('Firestore rules admin bootstrap parity', () => {
  const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
  const authContext = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('uses the same bootstrap email in rules and AuthContext helper', () => {
    expect(rules).toContain(`'${BOOTSTRAP_ADMIN_EMAIL}'`);
    expect(authContext).toMatch(/shouldBootstrapAdminRole/);
    expect(rules).toMatch(/isBootstrapAdminEmail/);
  });

  it('restricts bootstrap role create to self ADMIN with role-only payload', () => {
    expect(rules).toMatch(/match \/roles\/\{roleEmail\}/);
    expect(rules).toMatch(/isBootstrapAdminEmail\(\)/);
    expect(rules).toMatch(/roleEmail == request\.auth\.token\.email/);
    expect(rules).toMatch(/incoming\(\)\.keys\(\)\.hasOnly\(\['role'\]\)/);
    expect(rules).toMatch(/incoming\(\)\.role == 'ADMIN'/);
  });
});