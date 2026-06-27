import { describe, it, expect } from 'vitest';
import { filterStudentsBySearchAndClass } from './studentFilter';
import { Student } from '../types';

const students: Student[] = [
  { id: '1', fullName: 'أحمد محمد', classId: 'c1', className: '1أ', guardianName: '', guardianPhone: '', isActive: true },
  { id: '2', fullName: 'سارة علي', classId: 'c2', className: '2ب', guardianName: '', guardianPhone: '', isActive: true },
  { id: '3', fullName: 'محمد حسن', classId: 'c1', className: '1أ', guardianName: '', guardianPhone: '', isActive: true },
];

describe('filterStudentsBySearchAndClass', () => {
  it('filters by name case-insensitively', () => {
    const result = filterStudentsBySearchAndClass(students, 'محمد', 'all');
    expect(result.map((s) => s.id)).toEqual(['1', '3']);
  });

  it('filters by class when classFilter is set', () => {
    const result = filterStudentsBySearchAndClass(students, '', 'c1');
    expect(result.map((s) => s.id)).toEqual(['1', '3']);
  });

  it('combines search and class filters', () => {
    const result = filterStudentsBySearchAndClass(students, 'محمد', 'c2');
    expect(result).toHaveLength(0);
  });

  it('returns all students when search is empty and class is all', () => {
    expect(filterStudentsBySearchAndClass(students, '', 'all')).toHaveLength(3);
  });
});
