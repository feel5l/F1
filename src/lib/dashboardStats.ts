/**
 * Computes dashboard attendance rate: (present + late) / totalStudents.
 * Uses student headcount as denominator, unlike report log-based rates.
 */
export function calculateDashboardAttendanceRate(
  presentCount: number,
  lateCount: number,
  totalStudents: number
): number {
  if (totalStudents <= 0) return 0;
  return Math.round(((presentCount + lateCount) / totalStudents) * 100);
}
