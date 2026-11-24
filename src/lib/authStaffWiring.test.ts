import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('AuthContext staff/role wiring', () => {
  const authContext = readFileSync(resolve(__dirname, './AuthContext.tsx'), 'utf8');

  it('bootstraps admin via shouldBootstrapAdminRole', () => {
    expect(authContext).toMatch(/shouldBootstrapAdminRole/);
  });

  it('resolves staff with resolveStaffMemberAfterAuth', () => {
    expect(authContext).toMatch(/resolveStaffMemberAfterAuth/);
  });

  it('derives UI flags from deriveAuthRoleFlags', () => {
    expect(authContext).toMatch(/deriveAuthRoleFlags/);
  });
});