import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const SECURITY_SPEC_STATUSES = ['حاضر', 'غائب', 'متأخر', 'بعذر'] as const;

describe('attendance status enum (security_spec + types + rules)', () => {
  const types = readFileSync(resolve(__dirname, '../types.ts'), 'utf8');
  const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');
  const spec = readFileSync(resolve(__dirname, '../../security_spec.md'), 'utf8');

  it('lists the same four statuses in security_spec, types, and firestore.rules', () => {
    for (const status of SECURITY_SPEC_STATUSES) {
      expect(spec).toContain(`"${status}"`);
      expect(types).toContain(`"${status}"`);
      expect(rules).toContain(`'${status}'`);
    }
  });

  it('defines AttendanceStatus as a union of exactly those values', () => {
    expect(types).toMatch(
      /export type AttendanceStatus = "حاضر" \| "غائب" \| "متأخر" \| "بعذر"/
    );
  });
});