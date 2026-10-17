import { describe, it, expect } from 'vitest';
import { summarizeReportLogs } from './reportStats';

describe('summarizeReportLogs', () => {
  it('counts statuses and treats present, late, and excused as attendance for rate', () => {
    const stats = summarizeReportLogs([
      { status: 'حاضر' },
      { status: 'حاضر' },
      { status: 'غائب' },
      { status: 'متأخر' },
      { status: 'بعذر' },
    ]);
    expect(stats).toEqual({
      total: 5,
      present: 2,
      absent: 1,
      late: 1,
      excused: 1,
      rate: 80,
    });
  });

  it('returns zero rate when there are no logs', () => {
    expect(summarizeReportLogs([])).toEqual({
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      rate: 0,
    });
  });
});
