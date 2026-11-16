import { describe, it, expect } from 'vitest';
import { resolveAttendanceStatusDisplay } from './attendanceStatusDisplay';

describe('resolveAttendanceStatusDisplay', () => {
  it('maps known Arabic attendance statuses', () => {
    expect(resolveAttendanceStatusDisplay('حاضر')).toEqual({ label: 'حاضر', variant: 'success' });
    expect(resolveAttendanceStatusDisplay('غائب')).toEqual({ label: 'غائب', variant: 'destructive' });
    expect(resolveAttendanceStatusDisplay('متأخر')).toEqual({ label: 'متأخر', variant: 'warning' });
    expect(resolveAttendanceStatusDisplay('بعذر')).toEqual({ label: 'بعذر', variant: 'info' });
  });

  it('falls back to outline for unknown statuses', () => {
    expect(resolveAttendanceStatusDisplay('مجهول')).toEqual({
      label: 'مجهول',
      variant: 'outline',
    });
  });
});