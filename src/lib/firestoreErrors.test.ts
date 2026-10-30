import { describe, it, expect } from 'vitest';
import {
  OperationType,
  buildFirestoreErrorInfo,
  formatFirestoreErrorPayload,
} from './firestoreErrors';

describe('buildFirestoreErrorInfo', () => {
  it('captures operation, path, and auth snapshot', () => {
    const info = buildFirestoreErrorInfo(
      new Error('permission-denied'),
      OperationType.WRITE,
      'students',
      {
        uid: 'uid-1',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      }
    );

    expect(info.error).toBe('permission-denied');
    expect(info.operationType).toBe(OperationType.WRITE);
    expect(info.path).toBe('students');
    expect(info.authInfo.email).toBe('teacher@ghiabi.com');
  });

  it('stringifies non-Error values', () => {
    const info = buildFirestoreErrorInfo('offline', OperationType.GET, null, null);
    expect(info.error).toBe('offline');
    expect(info.authInfo.userId).toBeNull();
  });
});

describe('formatFirestoreErrorPayload', () => {
  it('produces JSON suitable for thrown Error messages', () => {
    const info = buildFirestoreErrorInfo(
      new Error('denied'),
      OperationType.DELETE,
      'staff/1',
      { uid: 'u1' }
    );
    const parsed = JSON.parse(formatFirestoreErrorPayload(info));
    expect(parsed.path).toBe('staff/1');
    expect(parsed.authInfo.userId).toBe('u1');
  });
});
