export type CsvRow = Record<string, unknown>;

export type ImportRowErrorReason = 'missing_required_fields' | 'invalid_is_active';

export interface ImportRowError {
  /**
   * 1-based row number in the original CSV file.
   * With header row enabled, the first data row is row 2.
   */
  rowNumber: number;
  reason: ImportRowErrorReason;
  message: string;
  raw: CsvRow;
}

export interface NormalizedClass {
  /**
   * Unique logical key: `${gradeLevel}__${className}`
   */
  key: string;
  className: string;
  gradeLevel: string;
  teacherEmail?: string;
}

export interface NormalizedStudent {
  classKey: string;
  studentFullName: string;
  guardianName?: string;
  guardianPhone?: string;
  parentEmail?: string;
  isActive?: boolean;
}

export interface ImportPreview {
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  classesDiscovered: number;
  studentsDiscovered: number;
  errors: ImportRowError[];
  classes: NormalizedClass[];
  students: NormalizedStudent[];
}

export function normalizeText(v: unknown): string {
  const s = (v ?? '').toString();
  return s.replace(/\s+/g, ' ').trim();
}

export function normalizeEmail(v: unknown): string {
  return normalizeText(v).toLowerCase();
}

export function buildClassKey(gradeLevel: string, className: string): string {
  return `${gradeLevel}__${className}`;
}

export function parseIsActive(v: unknown): { value?: boolean; error?: string } {
  const s = normalizeText(v);
  if (!s) return { value: undefined };

  const lower = s.toLowerCase();
  if (lower === 'true' || lower === '1') return { value: true };
  if (lower === 'false' || lower === '0') return { value: false };

  return { error: 'is_active must be true/false or 1/0' };
}

export function buildPreview(rows: CsvRow[]): ImportPreview {
  const errors: ImportRowError[] = [];
  const classesMap = new Map<string, NormalizedClass>();
  const students: NormalizedStudent[] = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    // Header row is 1, so first data row is 2
    const rowNumber = i + 2;

    const className = normalizeText(raw['class_name']);
    const gradeLevel = normalizeText(raw['grade_level']);
    const studentFullName = normalizeText(raw['student_full_name']);

    if (!className || !gradeLevel || !studentFullName) {
      errors.push({
        rowNumber,
        reason: 'missing_required_fields',
        message: 'class_name, grade_level, student_full_name are required',
        raw,
      });
      continue;
    }

    const classKey = buildClassKey(gradeLevel, className);
    const teacherEmail = normalizeEmail(raw['teacher_email']);

    if (!classesMap.has(classKey)) {
      classesMap.set(classKey, {
        key: classKey,
        className,
        gradeLevel,
        teacherEmail: teacherEmail || undefined,
      });
    } else if (teacherEmail) {
      const existing = classesMap.get(classKey)!;
      existing.teacherEmail = teacherEmail;
      classesMap.set(classKey, existing);
    }

    const parsedActive = parseIsActive(raw['is_active']);
    if (parsedActive.error) {
      errors.push({
        rowNumber,
        reason: 'invalid_is_active',
        message: parsedActive.error,
        raw,
      });
      continue;
    }

    students.push({
      classKey,
      studentFullName,
      guardianName: normalizeText(raw['guardian_name']) || undefined,
      guardianPhone: normalizeText(raw['guardian_phone']) || undefined,
      parentEmail: normalizeEmail(raw['parent_email']) || undefined,
      isActive: parsedActive.value,
    });
  }

  const classes = Array.from(classesMap.values());
  const acceptedRows = rows.length - errors.length;

  return {
    totalRows: rows.length,
    acceptedRows,
    rejectedRows: errors.length,
    classesDiscovered: classes.length,
    studentsDiscovered: students.length,
    errors,
    classes,
    students,
  };
}
