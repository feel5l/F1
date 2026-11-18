import type { AppRole } from '../types';

export type AdminBootstrapRoleDoc = { role: Extract<AppRole, 'ADMIN'> };

/** Payload for roles/{email} self-bootstrap (must match firestore.rules create). */
export function buildAdminBootstrapRoleDoc(): AdminBootstrapRoleDoc {
  return { role: 'ADMIN' };
}

export function isRulesCompliantBootstrapRoleDoc(
  doc: Record<string, unknown>
): doc is AdminBootstrapRoleDoc {
  const keys = Object.keys(doc);
  return keys.length === 1 && keys[0] === 'role' && doc.role === 'ADMIN';
}