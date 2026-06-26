import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: {
    currentUser: {
      uid: 'user-123',
      email: 'teacher@ghiabi.com',
      emailVerified: true,
      isAnonymous: false,
      tenantId: null,
    },
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDocFromServer: vi.fn(() => Promise.reject(new Error('offline'))),
}));

vi.mock('../../firebase-applet-config.json', () => ({
  default: { firestoreDatabaseId: 'test-db' },
}));

import { handleFirestoreError, OperationType } from './firebase';

describe('handleFirestoreError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('throws structured error with auth context', () => {
    expect(() =>
      handleFirestoreError(new Error('permission-denied'), OperationType.WRITE, 'students/abc')
    ).toThrow();

    try {
      handleFirestoreError(new Error('permission-denied'), OperationType.WRITE, 'students/abc');
    } catch (error) {
      const parsed = JSON.parse((error as Error).message);
      expect(parsed.error).toBe('permission-denied');
      expect(parsed.operationType).toBe(OperationType.WRITE);
      expect(parsed.path).toBe('students/abc');
      expect(parsed.authInfo.email).toBe('teacher@ghiabi.com');
      expect(parsed.authInfo.userId).toBe('user-123');
    }
  });

  it('stringifies non-Error values', () => {
    try {
      handleFirestoreError('network failure', OperationType.LIST, null);
    } catch (error) {
      const parsed = JSON.parse((error as Error).message);
      expect(parsed.error).toBe('network failure');
      expect(parsed.path).toBeNull();
    }
  });

  it('handles missing current user', () => {
    mockAuth.currentUser = null as unknown as typeof mockAuth.currentUser;

    try {
      handleFirestoreError(new Error('unauthenticated'), OperationType.GET, 'roles/x');
    } catch (error) {
      const parsed = JSON.parse((error as Error).message);
      expect(parsed.authInfo.userId).toBeUndefined();
      expect(parsed.authInfo.email).toBeUndefined();
    } finally {
      mockAuth.currentUser = {
        uid: 'user-123',
        email: 'teacher@ghiabi.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: null,
      };
    }
  });
});
