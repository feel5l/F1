import { describe, it, expect } from 'vitest';
import {
  STUDENT_CSV_HEADERS,
  buildStudentCsvExportRows,
  formatStudentActiveStatus,
  resolveStudentClassNameForExport,
} from './studentExport';
import { Class, Student } from '../types';

const classes: Class[] = [
  { id: 'c1', name: 'الثالث 1', gradeLevel: '3' },
];

const student: Student = {
  id: 's1',
  fullName: 'أحمد',
  classId: 'c1',
  className: 'قديم',
  guardianName: 'ولي',
  guardianPhone: '050',
  isActive: true,
};

describe('formatStudentActiveStatus', () => {
  it('maps active flag to Arabic labels', () => {
    expect(formatStudentActiveStatus(true)).toBe('نشط');
    expect(formatStudentActiveStatus(false)).toBe('غير نشط');
  });
});

describe('resolveStudentClassNameForExport', () => {
  it('prefers live class list over stale className on student', () => {
    expect(resolveStudentClassNameForExport(student, classes)).toBe('الثالث 1');
  });

  it('falls back to student.className then placeholder', () => {
    expect(
      resolveStudentClassNameForExport({ ...student, classId: 'missing' }, classes)
    ).toBe('قديم');
    expect(
      resolveStudentClassNameForExport(
        { ...student, classId: 'missing', className: '' },
        classes
      )
    ).toBe('غير محدد');
  });
});

describe('buildStudentCsvExportRows', () => {
  it('uses stable column order matching export headers', () => {
    const rows = buildStudentCsvExportRows(
      [{ ...student, guardianName: '', guardianPhone: '', isActive: false }],
      classes
    );
    expect(STUDENT_CSV_HEADERS.length).toBe(6);
    expect(rows[0]).toEqual([
      's1',
      'أحمد',
      'الثالث 1',
      '-',
      '-',
      'غير نشط',
    ]);
  });
});
