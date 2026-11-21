import { describe, it, expect } from 'vitest';
import {
  buildAdminBootstrapRoleDoc,
  isRulesCompliantBootstrapRoleDoc,
} from './adminBootstrapRole';

describe('buildAdminBootstrapRoleDoc', () => {
  it('writes only the role field required by firestore.rules', () => {
    const doc = buildAdminBootstrapRoleDoc();
    expect(doc).toEqual({ role: 'ADMIN' });
    expect(isRulesCompliantBootstrapRoleDoc(doc)).toBe(true);
  });

  it('rejects payloads with extra fields that rules would deny', () => {
    expect(isRulesCompliantBootstrapRoleDoc({ role: 'ADMIN', updatedAt: new Date() })).toBe(
      false
    );
    expect(isRulesCompliantBootstrapRoleDoc({ role: 'TEACHER' })).toBe(false);
  });
});