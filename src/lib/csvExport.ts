/** Student directory CSV (Students page export). */
export const STUDENT_CSV_HEADERS = [
  'المعرف',
  'الاسم الكامل',
  'الفصل',
  'اسم ولي الأمر',
  'هاتف ولي الأمر',
  'الحالة',
] as const;

export function resolveStudentExportClassName(
  classes: ReadonlyArray<{ id: string; name: string }>,
  student: { classId: string; className?: string }
): string {
  return classes.find((c) => c.id === student.classId)?.name || student.className || 'غير محدد';
}

export function formatStudentActiveStatus(isActive: boolean): 'نشط' | 'غير نشط' {
  return isActive ? 'نشط' : 'غير نشط';
}

export function buildStudentCsvRow(
  student: {
    id: string;
    fullName: string;
    guardianName?: string;
    guardianPhone?: string;
    isActive: boolean;
  },
  className: string
): string[] {
  return [
    student.id,
    student.fullName,
    className,
    student.guardianName || '-',
    student.guardianPhone || '-',
    formatStudentActiveStatus(student.isActive),
  ];
}

/** Attendance logs CSV (Reports page export). */
export const ATTENDANCE_REPORT_CSV_HEADERS = [
  'التاريخ',
  'الطالب',
  'الحالة',
  'الملاحظات',
] as const;

export function buildAttendanceReportCsvRow(
  formattedTimestamp: string,
  studentId: string,
  status: string,
  note?: string
): string[] {
  return [formattedTimestamp, studentId, status, note ?? ''];
}

/** Matches legacy UI: comma-joined rows, optional UTF-8 BOM for Excel. */
export function serializeCsvTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  options?: { utf8Bom?: boolean }
): string {
  const body = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return options?.utf8Bom ? `\uFEFF${body}` : body;
}