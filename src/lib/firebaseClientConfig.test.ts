import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard for fix/security: Firebase client uses checked-in applet config only. */
describe('firebase.ts client init', () => {
  const source = readFileSync(resolve(__dirname, './firebase.ts'), 'utf8');

  it('loads config from firebase-applet-config.json without env injection', () => {
    expect(source).toMatch(/firebase-applet-config\.json/);
    expect(source).not.toMatch(/process\.env/);
    expect(source).not.toMatch(/GEMINI_API_KEY/);
    expect(source).not.toMatch(/dotenv/);
  });
});