import { describe, it, expect, vi } from 'vitest';
import {
  OperationType,
  buildFirestoreErrorInfo,
  handleFirestoreError,
} from './firestoreErrors';

describe('buildFirestoreErrorInfo', () => {
  it('serializes Error messages and auth context', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission denied'),
      OperationType.WRITE,
      'students',
      {
        uid: 'u1',
        email: 'teacher@school.sa',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      } as import('firebase/auth').User
    );

    expect(info).toMatchObject({
      error: 'permission denied',
      operationType: OperationType.WRITE,
      path: 'students',
      authInfo: {
        userId: 'u1',
        email: 'teacher@school.sa',
        emailVerified: true,
        isAnonymous: false,
      },
    });
  });

  it('stringifies non-Error failures', () => {
    const info = buildFirestoreErrorInfo('offline', OperationType.LIST, null, null);
    expect(info.error).toBe('offline');
    expect(info.authInfo.userId).toBeUndefined();
  });
});

describe('handleFirestoreError', () => {
  it('throws JSON payload including operation metadata', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      handleFirestoreError(new Error('denied'), OperationType.DELETE, 'staff/x', null)
    ).toThrow(/"operationType":"delete"/);

    consoleSpy.mockRestore();
  });
});
