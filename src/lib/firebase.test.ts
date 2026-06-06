import { describe, it, expect } from 'vitest';
import { buildFirestoreErrorInfo, OperationType } from './firebase';

describe('buildFirestoreErrorInfo', () => {
  it('serializes Error messages', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission denied'),
      OperationType.GET,
      'students/abc',
      { email: 'admin@ghiabi.com', userId: 'uid-1' }
    );

    expect(info).toEqual({
      error: 'permission denied',
      operationType: OperationType.GET,
      path: 'students/abc',
      authInfo: { email: 'admin@ghiabi.com', userId: 'uid-1' },
    });
  });

  it('stringifies non-Error values', () => {
    const info = buildFirestoreErrorInfo('network failure', OperationType.LIST, null, {});
    expect(info.error).toBe('network failure');
    expect(info.path).toBeNull();
  });
});
