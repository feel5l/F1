import { describe, it, expect } from 'vitest';
import { isKnownAttendanceStatus, resolveAttendanceStatusDisplay } from './attendanceStatusDisplay';

describe('resolveAttendanceStatusDisplay', () => {
  it('maps canonical Arabic attendance statuses', () => {
    expect(resolveAttendanceStatusDisplay('حاضر')).toMatchObject({
      tone: 'present',
      badgeClassName: 'bg-green-600',
    });
    expect(resolveAttendanceStatusDisplay('غائب').destructive).toBe(true);
    expect(resolveAttendanceStatusDisplay('متأخر').tone).toBe('late');
    expect(resolveAttendanceStatusDisplay('بعذر').tone).toBe('excused');
  });

  it('falls back for legacy or corrupt status values', () => {
    const display = resolveAttendanceStatusDisplay('???');
    expect(display.tone).toBe('unknown');
    expect(display.outline).toBe(true);
    expect(display.label).toBe('???');
    expect(isKnownAttendanceStatus('???')).toBe(false);
  });
});