import { describe, it, expect } from 'vitest';
import { BOOTSTRAP_ADMIN_EMAIL, shouldBootstrapAdminRole } from './bootstrapAdmin';

describe('shouldBootstrapAdminRole', () => {
  it('bootstraps only the configured admin email without an existing role', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, null)).toBe(true);
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, undefined)).toBe(true);
  });

  it('does not bootstrap when role already exists', () => {
    expect(shouldBootstrapAdminRole(BOOTSTRAP_ADMIN_EMAIL, 'ADMIN')).toBe(false);
  });

  it('does not bootstrap other emails', () => {
    expect(shouldBootstrapAdminRole('other@example.com', null)).toBe(false);
    expect(shouldBootstrapAdminRole(null, null)).toBe(false);
  });
});
