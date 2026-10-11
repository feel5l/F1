import { describe, it, expect } from 'vitest';
import { calculateAttendanceStats } from './attendanceStats';
import {
  calculateDashboardAttendanceRate,
  summarizeDashboardLogStatuses,
} from './dashboardStats';
import { AttendanceStatus } from '../types';

/**
 * Regression guard: attendance submission UI and dashboard KPIs intentionally
 * treat excused absences (بعذر) differently.
 */
describe('attendance metrics policy (excused handling)', () => {
  const statuses: AttendanceStatus[] = ['حاضر', 'غائب', 'متأخر', 'بعذر'];

  it('includes excused in attendance page compliance rate', () => {
    expect(calculateAttendanceStats(statuses).rate).toBe(75);
  });

  it('excludes excused from dashboard KPI counters', () => {
    expect(summarizeDashboardLogStatuses(statuses)).toEqual({
      presentCount: 1,
      absentCount: 1,
      lateCount: 1,
    });
  });

  it('uses student headcount denominator on dashboard rate', () => {
    const kpi = summarizeDashboardLogStatuses(statuses);
    expect(
      calculateDashboardAttendanceRate(kpi.presentCount, kpi.lateCount, 10)
    ).toBe(20);
  });
});
