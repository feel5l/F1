import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard: reports filters, charts, and CSV export must stay on shared analytics libs. */
describe('Reports.tsx analytics and export wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Reports.tsx'), 'utf8');

  it('scopes class list and log queries via reportAnalytics and teacherDataScope', () => {
    expect(source).toMatch(/filterClassesForReportsView/);
    expect(source).toMatch(/filterLogsByDateRange/);
    expect(source).toMatch(/shouldFilterAttendanceByTeacherEmail\(isAdmin, user\?\.email\)/);
    expect(source).toMatch(/where\('teacherEmail', '==', user!\.email\)/);
  });

  it('derives chart and summary stats from attendanceStats/reportAnalytics', () => {
    expect(source).toMatch(/summarizeReportLogStats/);
    expect(source).toMatch(/aggregateAttendanceLogsByDay/);
  });

  it('exports attendance CSV through csvExport helpers with shared headers', () => {
    expect(source).toMatch(/ATTENDANCE_REPORT_CSV_HEADERS/);
    expect(source).toMatch(/buildAttendanceReportCsvRow/);
    expect(source).toMatch(/serializeCsvTable\(ATTENDANCE_REPORT_CSV_HEADERS, rows\)/);
    expect(source).not.toMatch(/const headers = \['التاريخ'/);
  });

  it('keeps periodic refresh without bypassing role filters on fetchLogs', () => {
    expect(source).toMatch(/setInterval\(\(\) => \{\s*fetchLogs\(\)/s);
    expect(source).toMatch(/5 \* 60 \* 1000/);
  });
});