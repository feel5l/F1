import { describe, it, expect } from 'vitest';
import { createFirestoreErrorPayload, OperationType } from './firestoreErrors';

describe('createFirestoreErrorPayload', () => {
  it('serializes Error instances with auth context', () => {
    const payload = createFirestoreErrorPayload(
      new Error('permission denied'),
      OperationType.DELETE,
      'students/abc',
      { userId: 'uid-1', email: 'teacher@school.com', emailVerified: true }
    );

    expect(payload).toEqual({
      error: 'permission denied',
      operationType: OperationType.DELETE,
      path: 'students/abc',
      authInfo: {
        userId: 'uid-1',
        email: 'teacher@school.com',
        emailVerified: true,
      },
    });
  });

  it('stringifies non-Error values', () => {
    const payload = createFirestoreErrorPayload('offline', OperationType.LIST, null, {});
    expect(payload.error).toBe('offline');
    expect(payload.path).toBeNull();
  });
});
