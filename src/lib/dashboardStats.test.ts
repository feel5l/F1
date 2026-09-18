import { describe, it, expect } from 'vitest';
import { calculateDashboardAttendanceRate } from './dashboardStats';

describe('calculateDashboardAttendanceRate', () => {
  it('counts present and late toward attendance rate', () => {
    expect(calculateDashboardAttendanceRate(8, 2, 10)).toBe(100);
    expect(calculateDashboardAttendanceRate(7, 1, 10)).toBe(80);
  });

  it('returns zero when there are no students', () => {
    expect(calculateDashboardAttendanceRate(5, 3, 0)).toBe(0);
  });

  it('rounds to whole percent', () => {
    expect(calculateDashboardAttendanceRate(1, 0, 3)).toBe(33);
  });

  it('excludes absent and excused from numerator', () => {
    expect(calculateDashboardAttendanceRate(0, 0, 10)).toBe(0);
  });
});
