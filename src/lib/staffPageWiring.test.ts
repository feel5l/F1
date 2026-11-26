import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Staff.tsx wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Staff.tsx'), 'utf8');

  it('filters staff via filterStaffList helper', () => {
    expect(source).toMatch(/filterStaffList/);
  });

  it('syncs roles collection when updating appRole (Firestore rules)', () => {
    expect(source).toMatch(/doc\(db, 'roles', editingMember\.email\)/);
    expect(source).toMatch(/setDoc\(roleRef/);
  });
});