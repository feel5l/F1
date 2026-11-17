export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorAuthInfo {
  userId?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  isAnonymous?: boolean | null;
  tenantId?: string | null;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: FirestoreErrorAuthInfo;
}

export function buildFirestoreErrorInfo(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInfo: FirestoreErrorAuthInfo
): FirestoreErrorInfo {
  return {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo,
  };
}
