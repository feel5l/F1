import type { FirestoreErrorInfo, OperationType } from './firebase';

export interface AuthSnapshot {
  userId?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  isAnonymous?: boolean | null;
  tenantId?: string | null;
}

/**
 * Builds structured Firestore error metadata for logging and re-throwing.
 */
export function buildFirestoreErrorInfo(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInfo: AuthSnapshot
): FirestoreErrorInfo {
  return {
    error: error instanceof Error ? error.message : String(error),
    authInfo,
    operationType,
    path,
  };
}

export function formatFirestoreError(info: FirestoreErrorInfo): string {
  return JSON.stringify(info);
}
