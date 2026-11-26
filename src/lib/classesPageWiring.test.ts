import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Classes.tsx wiring', () => {
  const source = readFileSync(resolve(__dirname, '../pages/Classes.tsx'), 'utf8');

  it('routes Firestore failures through handleFirestoreError on class mutations', () => {
    expect(source).toMatch(/handleFirestoreError\(err, OperationType\.UPDATE, 'classes'\)/);
    expect(source).toMatch(/handleFirestoreError\(err, OperationType\.DELETE, 'classes'\)/);
  });
});