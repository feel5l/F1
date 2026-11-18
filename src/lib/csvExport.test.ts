import { describe, it, expect } from 'vitest';
import {
  STUDENT_CSV_HEADERS,
  resolveStudentExportClassName,
  buildStudentCsvRow,
  serializeCsvTable,
  ATTENDANCE_REPORT_CSV_HEADERS,
  buildAttendanceReportCsvRow,
} from './csvExport';

describe('resolveStudentExportClassName', () => {
  const classes = [{ id: 'c1', name: 'الصف 1/أ' }];

  it('prefers live class name from classes collection', () => {
    expect(resolveStudentExportClassName(classes, { classId: 'c1', className: 'قديم' })).toBe(
      'الصف 1/أ'
    );
  });

  it('falls back to stored className then placeholder', () => {
    expect(resolveStudentExportClassName(classes, { classId: 'missing', className: '1/ب' })).toBe(
      '1/ب'
    );
    expect(resolveStudentExportClassName(classes, { classId: 'missing' })).toBe('غير محدد');
  });
});

describe('buildStudentCsvRow', () => {
  it('maps fields and inactive status', () => {
    expect(
      buildStudentCsvRow(
        {
          id: 's1',
          fullName: 'أحمد',
          guardianName: '',
          guardianPhone: '05',
          isActive: false,
        },
        '1/أ'
      )
    ).toEqual(['s1', 'أحمد', '1/أ', '-', '05', 'غير نشط']);
  });
});

describe('serializeCsvTable', () => {
  it('adds UTF-8 BOM for student exports', () => {
    const csv = serializeCsvTable(STUDENT_CSV_HEADERS, [['a', 'b']], { utf8Bom: true });
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('المعرف,الاسم الكامل');
    expect(csv.endsWith('a,b')).toBe(true);
  });

  it('builds attendance report rows without BOM', () => {
    const rows = [buildAttendanceReportCsvRow('2026-01-01', 'stu-1', 'حاضر', '')];
    const csv = serializeCsvTable(ATTENDANCE_REPORT_CSV_HEADERS, rows);
    expect(csv).toBe('التاريخ,الطالب,الحالة,الملاحظات\n2026-01-01,stu-1,حاضر,');
  });
});