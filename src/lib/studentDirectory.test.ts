import { describe, it, expect } from 'vitest';
import { filterStudentsForDirectory } from './studentDirectory';

const roster = [
  { id: '1', fullName: 'أحمد علي', classId: 'c1' },
  { id: '2', fullName: 'سارة محمد', classId: 'c1' },
  { id: '3', fullName: 'خالد أحمد', classId: 'c2' },
];

describe('filterStudentsForDirectory', () => {
  it('matches name case-insensitively', () => {
    expect(filterStudentsForDirectory(roster, 'أحمد', 'all')).toHaveLength(2);
    expect(filterStudentsForDirectory(roster, 'سارة', 'all').map((s) => s.id)).toEqual(['2']);
  });

  it('restricts to a class when filter is set', () => {
    expect(filterStudentsForDirectory(roster, '', 'c2')).toEqual([roster[2]]);
    expect(filterStudentsForDirectory(roster, 'أحمد', 'c2')).toEqual([roster[2]]);
  });

  it('returns empty when search and class do not overlap', () => {
    expect(filterStudentsForDirectory(roster, 'سارة', 'c2')).toEqual([]);
  });
});
