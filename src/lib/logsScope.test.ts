import { describe, it, expect } from 'vitest';
import { resolveLogsQueryScope, DEFAULT_LOGS_LIMIT } from './logsScope';

describe('resolveLogsQueryScope', () => {
  it('returns all-logs scope for admins', () => {
    expect(resolveLogsQueryScope(true, 'admin@ghiabi.com')).toEqual({
      type: 'all',
      limit: DEFAULT_LOGS_LIMIT,
    });
  });

  it('scopes non-admin teachers to their own email', () => {
    expect(resolveLogsQueryScope(false, 'teacher@ghiabi.com')).toEqual({
      type: 'by-teacher',
      teacherEmail: 'teacher@ghiabi.com',
      limit: DEFAULT_LOGS_LIMIT,
    });
  });

  it('uses empty teacher email when non-admin has no email', () => {
    expect(resolveLogsQueryScope(false, null)).toEqual({
      type: 'by-teacher',
      teacherEmail: '',
      limit: DEFAULT_LOGS_LIMIT,
    });
  });

  it('respects custom limit parameter', () => {
    expect(resolveLogsQueryScope(true, null, 50)).toEqual({
      type: 'all',
      limit: 50,
    });
  });
});
