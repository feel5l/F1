import { describe, it, expect } from 'vitest';
import { validateStudentForm, filterStudents } from './studentForm';
import { Student } from '../types';

const sampleStudents: Student[] = [
  {
    id: '1',
    fullName: 'أحمد محمد',
    classId: 'c1',
    className: 'الأول',
    guardianName: '',
    guardianPhone: '',
    parentEmail: '',
    isActive: true,
  },
  {
    id: '2',
    fullName: 'سارة علي',
    classId: 'c2',
    className: 'الثاني',
    guardianName: '',
    guardianPhone: '',
    parentEmail: '',
    isActive: true,
  },
];

describe('validateStudentForm', () => {
  it('accepts complete form data', () => {
    expect(validateStudentForm({ fullName: 'أحمد', classId: 'c1' })).toBe(true);
  });

  it('rejects missing full name', () => {
    expect(validateStudentForm({ fullName: '', classId: 'c1' })).toBe(false);
    expect(validateStudentForm({ fullName: '   ', classId: 'c1' })).toBe(false);
  });

  it('rejects missing class', () => {
    expect(validateStudentForm({ fullName: 'أحمد', classId: '' })).toBe(false);
  });
});

describe('filterStudents', () => {
  it('returns all students when filters are empty', () => {
    expect(filterStudents(sampleStudents, '', 'all')).toHaveLength(2);
  });

  it('filters by search term case-insensitively', () => {
    const result = filterStudents(sampleStudents, 'سارة', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('سارة علي');
  });

  it('filters by class id', () => {
    const result = filterStudents(sampleStudents, '', 'c1');
    expect(result).toHaveLength(1);
    expect(result[0].classId).toBe('c1');
  });

  it('combines search and class filters', () => {
    expect(filterStudents(sampleStudents, 'أحمد', 'c2')).toHaveLength(0);
    expect(filterStudents(sampleStudents, 'أحمد', 'c1')).toHaveLength(1);
  });
});
