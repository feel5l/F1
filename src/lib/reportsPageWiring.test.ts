import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Reports.tsx wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Reports.tsx'), 'utf8');

  it('uses computeReportsDisciplineRate for summary rate', () => {
    expect(source).toMatch(/computeReportsDisciplineRate/);
  });

  it('filters logs by shared date-range helper and class access helper', () => {
    expect(source).toMatch(/filterLogsByReportsDateRange/);
    expect(source).toMatch(/filterClassesForUser/);
  });
});