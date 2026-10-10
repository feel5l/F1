import { describe, it, expect } from 'vitest';
import { OperationType } from './firebase';
import { buildFirestoreErrorInfo, formatFirestoreError } from './firestoreError';

describe('buildFirestoreErrorInfo', () => {
  it('captures Error messages and auth snapshot', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission denied'),
      OperationType.DELETE,
      'students/abc',
      {
        userId: 'uid-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      }
    );

    expect(info.error).toBe('permission denied');
    expect(info.operationType).toBe(OperationType.DELETE);
    expect(info.path).toBe('students/abc');
    expect(info.authInfo.email).toBe('teacher@ghiabi.com');
  });

  it('stringifies non-Error throws', () => {
    const info = buildFirestoreErrorInfo('offline', OperationType.LIST, null, {});
    expect(info.error).toBe('offline');
    expect(info.path).toBeNull();
  });
});

describe('formatFirestoreError', () => {
  it('returns JSON payload suitable for re-throwing', () => {
    const info = buildFirestoreErrorInfo(
      new Error('failed'),
      OperationType.WRITE,
      'attendanceLogs',
      { email: 'a@ghiabi.com' }
    );
    const serialized = formatFirestoreError(info);
    expect(JSON.parse(serialized)).toMatchObject({
      error: 'failed',
      path: 'attendanceLogs',
      authInfo: { email: 'a@ghiabi.com' },
    });
  });
});
