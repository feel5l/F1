import { describe, it, expect } from 'vitest';
import { filterStudents } from './students';
import { Student } from '../types';

const sampleStudents: Student[] = [
  {
    id: '1',
    fullName: 'أحمد علي',
    classId: 'c1',
    className: 'الأول أ',
    guardianName: 'علي',
    guardianPhone: '0500000000',
    isActive: true,
  },
  {
    id: '2',
    fullName: 'سارة محمد',
    classId: 'c2',
    className: 'الثاني ب',
    guardianName: 'محمد',
    guardianPhone: '0500000001',
    isActive: true,
  },
  {
    id: '3',
    fullName: 'أحمد خالد',
    classId: 'c1',
    className: 'الأول أ',
    guardianName: 'خالد',
    guardianPhone: '0500000002',
    isActive: false,
  },
];

describe('filterStudents', () => {
  it('returns all students when search and class filter are empty/all', () => {
    expect(filterStudents(sampleStudents, '', 'all')).toHaveLength(3);
  });

  it('filters by case-insensitive name search', () => {
    const filtered = filterStudents(sampleStudents, 'أحمد', 'all');
    expect(filtered).toHaveLength(2);
    expect(filtered.map((s) => s.id)).toEqual(['1', '3']);
  });

  it('filters by class id', () => {
    const filtered = filterStudents(sampleStudents, '', 'c1');
    expect(filtered).toHaveLength(2);
    expect(filtered.every((s) => s.classId === 'c1')).toBe(true);
  });

  it('applies both search and class filters together', () => {
    const filtered = filterStudents(sampleStudents, 'أحمد', 'c1');
    expect(filtered).toHaveLength(2);
  });

  it('returns empty array when no students match', () => {
    expect(filterStudents(sampleStudents, 'غير موجود', 'all')).toEqual([]);
    expect(filterStudents(sampleStudents, '', 'missing-class')).toEqual([]);
  });
});
