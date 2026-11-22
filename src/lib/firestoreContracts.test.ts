import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  FIRESTORE_ATTENDANCE_STATUSES,
  SESSION_PERIOD_MAX,
  SESSION_PERIOD_MIN,
  isFirestoreAttendanceStatus,
  isValidFirestoreDocumentId,
  isValidFirestoreSessionPeriod,
} from './firestoreContracts';

describe('isValidFirestoreDocumentId', () => {
  it('accepts typical Firestore auto-ids and rejects invalid shapes', () => {
    expect(isValidFirestoreDocumentId('class-9_abc')).toBe(true);
    expect(isValidFirestoreDocumentId('')).toBe(false);
    expect(isValidFirestoreDocumentId('bad id')).toBe(false);
    expect(isValidFirestoreDocumentId('x'.repeat(129))).toBe(false);
  });
});

describe('isValidFirestoreSessionPeriod', () => {
  it('enforces 1–10 bounds from security rules', () => {
    expect(isValidFirestoreSessionPeriod(SESSION_PERIOD_MIN)).toBe(true);
    expect(isValidFirestoreSessionPeriod(SESSION_PERIOD_MAX)).toBe(true);
    expect(isValidFirestoreSessionPeriod(0)).toBe(false);
    expect(isValidFirestoreSessionPeriod(11)).toBe(false);
    expect(isValidFirestoreSessionPeriod(2.5)).toBe(false);
  });
});

describe('attendance status whitelist', () => {
  it('recognizes only rule-approved Arabic statuses', () => {
    for (const status of FIRESTORE_ATTENDANCE_STATUSES) {
      expect(isFirestoreAttendanceStatus(status)).toBe(true);
    }
    expect(isFirestoreAttendanceStatus('present')).toBe(false);
    expect(isFirestoreAttendanceStatus('')).toBe(false);
  });

  it('stays aligned with firestore.rules isValidLog', () => {
    const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
    const match = rules.match(/data\.status in \[([^\]]+)\]/);
    expect(match).not.toBeNull();
    for (const status of FIRESTORE_ATTENDANCE_STATUSES) {
      expect(match![1]).toContain(`'${status}'`);
    }
  });
});