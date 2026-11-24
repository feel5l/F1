import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const authSource = readFileSync(path.join(__dirname, 'AuthContext.tsx'), 'utf8');

describe('AuthContext wiring regressions', () => {
  it('centralizes bootstrap admin check in roleAccess', () => {
    expect(authSource).toContain('shouldBootstrapAdminRole');
    expect(authSource).not.toContain('alzaem3000@gmail.com');
  });

  it('derives permission flags from shared helper', () => {
    expect(authSource).toContain('deriveAuthRoleFlags');
  });

  it('resolves staff via staffResolution helper', () => {
    expect(authSource).toContain('resolveStaffMemberFromAuthData');
  });
});