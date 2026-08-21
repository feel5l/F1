import { describe, it, expect } from 'vitest';
import { filterStudents } from './studentFilter';

const sampleStudents = [
  { id: '1', fullName: 'أحمد محمد', classId: 'c1' },
  { id: '2', fullName: 'سارة علي', classId: 'c1' },
  { id: '3', fullName: 'محمد أحمد', classId: 'c2' },
];

describe('filterStudents', () => {
  it('returns all students when search is empty and class is all', () => {
    expect(filterStudents(sampleStudents, '', 'all')).toHaveLength(3);
  });

  it('filters by name search case-insensitively', () => {
    const filtered = filterStudents(sampleStudents, 'أحمد', 'all');
    expect(filtered.map((s) => s.id)).toEqual(['1', '3']);
  });

  it('filters by class id', () => {
    const filtered = filterStudents(sampleStudents, '', 'c1');
    expect(filtered.map((s) => s.id)).toEqual(['1', '2']);
  });

  it('combines search and class filters', () => {
    const filtered = filterStudents(sampleStudents, 'سارة', 'c1');
    expect(filtered.map((s) => s.id)).toEqual(['2']);
  });

  it('returns empty when no matches', () => {
    expect(filterStudents(sampleStudents, 'غير موجود', 'all')).toEqual([]);
    expect(filterStudents(sampleStudents, '', 'c99')).toEqual([]);
  });
});
