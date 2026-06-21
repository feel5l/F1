import { describe, it, expect } from 'vitest';
import { buildFirestoreErrorInfo, OperationType } from './firebase';

describe('buildFirestoreErrorInfo', () => {
  it('builds structured payload with auth context', () => {
    const payload = buildFirestoreErrorInfo(
      new Error('permission-denied'),
      OperationType.CREATE,
      'students/student-1',
      {
        userId: 'user-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      }
    );

    expect(payload).toEqual({
      error: 'permission-denied',
      operationType: OperationType.CREATE,
      path: 'students/student-1',
      authInfo: {
        userId: 'user-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      },
    });
  });

  it('stringifies non-Error values and defaults auth info', () => {
    const payload = buildFirestoreErrorInfo('offline', OperationType.LIST, null);

    expect(payload.error).toBe('offline');
    expect(payload.path).toBeNull();
    expect(payload.authInfo).toEqual({});
  });
});
