import { describe, it, expect } from 'vitest';
import { filterClassesForReportView } from './classAccess';

describe('filterClassesForReportView', () => {
  const classes = [
    { id: '1', teacherEmail: 'a@ghiabi.com' },
    { id: '2', teacherEmail: 'b@ghiabi.com' },
  ];

  it('returns all classes for admins', () => {
    expect(filterClassesForReportView(classes, true, 'a@ghiabi.com')).toEqual(classes);
  });

  it('restricts non-admins to their teacherEmail', () => {
    expect(filterClassesForReportView(classes, false, 'a@ghiabi.com')).toEqual([
      { id: '1', teacherEmail: 'a@ghiabi.com' },
    ]);
  });

  it('returns empty when teacher is unknown', () => {
    expect(filterClassesForReportView(classes, false, undefined)).toEqual([]);
  });
});
