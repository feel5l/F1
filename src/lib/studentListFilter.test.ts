import { describe, it, expect } from 'vitest';
import { filterStudents, matchesStudentFilters } from './studentListFilter';
import type { Student } from '../types';

const base: Omit<Student, 'id' | 'fullName' | 'classId'> = {
  className: '1أ',
  guardianName: '',
  guardianPhone: '',
  isActive: true,
};

const students: Student[] = [
  { id: '1', fullName: 'أحمد علي', classId: 'c1', ...base },
  { id: '2', fullName: 'سارة محمد', classId: 'c2', ...base },
];

describe('matchesStudentFilters', () => {
  it('matches case-insensitive Arabic search', () => {
    expect(matchesStudentFilters(students[0], 'أحمد', 'all')).toBe(true);
    expect(matchesStudentFilters(students[0], 'أحمد', 'c2')).toBe(false);
  });

  it('applies class filter when not "all"', () => {
    expect(matchesStudentFilters(students[1], 'سارة', 'c2')).toBe(true);
    expect(matchesStudentFilters(students[1], 'سارة', 'c1')).toBe(false);
  });
});

describe('filterStudents', () => {
  it('combines search and class filters', () => {
    expect(filterStudents(students, 'محمد', 'c2')).toEqual([students[1]]);
    expect(filterStudents(students, 'xyz', 'all')).toEqual([]);
  });
});