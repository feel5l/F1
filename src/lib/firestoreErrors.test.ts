import { describe, it, expect } from 'vitest';
import { buildFirestoreErrorInfo, OperationType } from './firestoreErrors';

describe('buildFirestoreErrorInfo', () => {
  it('serializes Error instances with auth context', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission denied'),
      OperationType.WRITE,
      'attendanceLogs',
      { userId: 'uid-1', email: 'teacher@ghiabi.com' }
    );

    expect(info).toEqual({
      error: 'permission denied',
      operationType: OperationType.WRITE,
      path: 'attendanceLogs',
      authInfo: { userId: 'uid-1', email: 'teacher@ghiabi.com' },
    });
  });

  it('stringifies non-Error throwables', () => {
    const info = buildFirestoreErrorInfo('network failure', OperationType.GET, null, {});
    expect(info.error).toBe('network failure');
    expect(info.path).toBeNull();
  });
});
