import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Regression guard: admin role edits must dual-write staff + roles/{email}
 * so Firestore security rules (getAppRole) stay aligned with the UI.
 */
describe('Staff.tsx roles collection sync', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Staff.tsx'), 'utf8');

  it('syncs roles/{email} via buildRolesCollectionRolePayload after staff.appRole update', () => {
    expect(source).toMatch(/from '\.\.\/lib\/staffRoleSync'/);
    expect(source).toMatch(/buildRolesCollectionRolePayload\(newRole\)/);
    expect(source).toMatch(/doc\(db, 'roles', editingMember\.email\)/);
    expect(source).toMatch(/setDoc\(roleRef/);
    expect(source).toMatch(/updateDoc\(memberRef,\s*\{\s*appRole: newRole/);
  });

  it('does not update roles collection when the member has no email', () => {
    expect(source).toMatch(/if \(editingMember\.email\)/);
  });

  it('uses shared staff search and badge helpers', () => {
    expect(source).toMatch(/filterStaffMembers/);
    expect(source).toMatch(/resolveStaffRoleBadgeMeta/);
  });

  it('exposes role edit controls only for admins', () => {
    const adminGatedBlocks = source.match(/\{isAdmin &&/g) ?? [];
    expect(adminGatedBlocks.length).toBeGreaterThanOrEqual(2);
  });
});