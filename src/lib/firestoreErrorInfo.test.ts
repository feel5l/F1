import { describe, it, expect } from 'vitest';
import { buildFirestoreErrorInfo } from './firestoreErrorInfo';
import { OperationType } from './firestoreErrorInfo';

describe('buildFirestoreErrorInfo', () => {
  it('serializes error details and auth context for diagnostics', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission-denied'),
      OperationType.WRITE,
      'attendanceLogs',
      {
        userId: 'uid-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      }
    );

    expect(info).toEqual({
      error: 'permission-denied',
      operationType: OperationType.WRITE,
      path: 'attendanceLogs',
      authInfo: {
        userId: 'uid-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      },
    });
  });

  it('stringifies non-Error throwables', () => {
    const info = buildFirestoreErrorInfo('offline', OperationType.LIST, null, {});
    expect(info.error).toBe('offline');
    expect(info.path).toBeNull();
  });
});
