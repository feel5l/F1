import { describe, it, expect } from 'vitest';
import { buildRolesCollectionRolePayload } from './staffRoleSync';

describe('buildRolesCollectionRolePayload', () => {
  it('stores role and updatedAt for Firestore rules source of truth', () => {
    const at = new Date('2026-11-15T10:00:00.000Z');
    expect(buildRolesCollectionRolePayload('SUPERVISOR', at)).toEqual({
      role: 'SUPERVISOR',
      updatedAt: at,
    });
  });
});