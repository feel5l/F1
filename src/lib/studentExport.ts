import { Class, Student } from '../types';

export const STUDENT_CSV_HEADERS = [
  'المعرف',
  'الاسم الكامل',
  'الفصل',
  'اسم ولي الأمر',
  'هاتف ولي الأمر',
  'الحالة',
] as const;

export function formatStudentActiveStatus(isActive: boolean): string {
  return isActive ? 'نشط' : 'غير نشط';
}

export function resolveStudentClassNameForExport(
  student: Student,
  classes: Class[]
): string {
  return (
    classes.find((c) => c.id === student.classId)?.name ||
    student.className ||
    'غير محدد'
  );
}

/**
 * Builds CSV body rows for the students export action (headers excluded).
 */
export function buildStudentCsvExportRows(
  students: Student[],
  classes: Class[]
): string[][] {
  return students.map((s) => [
    s.id,
    s.fullName,
    resolveStudentClassNameForExport(s, classes),
    s.guardianName || '-',
    s.guardianPhone || '-',
    formatStudentActiveStatus(s.isActive),
  ]);
}
