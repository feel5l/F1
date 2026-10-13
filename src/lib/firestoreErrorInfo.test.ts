import { describe, it, expect } from 'vitest';
import { buildFirestoreErrorInfo, OperationType } from './firestoreErrorInfo';

describe('buildFirestoreErrorInfo', () => {
  it('serializes Error instances and preserves operation metadata', () => {
    const info = buildFirestoreErrorInfo(new Error('permission denied'), OperationType.WRITE, 'students', {
      email: 't@school.com',
      userId: 'uid-1',
    });
    expect(info).toEqual({
      error: 'permission denied',
      operationType: OperationType.WRITE,
      path: 'students',
      authInfo: { email: 't@school.com', userId: 'uid-1' },
    });
  });

  it('stringifies non-Error throws', () => {
    const info = buildFirestoreErrorInfo({ code: 7 }, OperationType.DELETE, null, {});
    expect(info.error).toBe('[object Object]');
  });
});
