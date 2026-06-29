import { describe, expect, it } from 'vitest';
import { buildFirestoreErrorInfo, formatFirestoreErrorPayload, OperationType } from './firestoreErrors';

describe('buildFirestoreErrorInfo', () => {
  it('captures error message, operation, path, and auth snapshot', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission denied'),
      OperationType.WRITE,
      'students',
      { uid: 'u1', email: 'teacher@ghiabi.com', emailVerified: true },
    );

    expect(info).toEqual({
      error: 'permission denied',
      operationType: OperationType.WRITE,
      path: 'students',
      authInfo: {
        userId: 'u1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: undefined,
        tenantId: undefined,
      },
    });
  });

  it('stringifies non-Error values', () => {
    const info = buildFirestoreErrorInfo('timeout', OperationType.LIST, null, null);
    expect(info.error).toBe('timeout');
    expect(info.authInfo.userId).toBeNull();
  });
});

describe('formatFirestoreErrorPayload', () => {
  it('produces JSON suitable for error propagation', () => {
    const payload = formatFirestoreErrorPayload({
      error: 'not found',
      operationType: OperationType.GET,
      path: 'classes/c1',
      authInfo: { userId: null, email: 'admin@ghiabi.com' },
    });

    expect(JSON.parse(payload)).toMatchObject({
      error: 'not found',
      operationType: 'get',
      path: 'classes/c1',
    });
  });
});
