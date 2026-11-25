import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression for fix/security: client must load config from json, not inline secrets. */
describe('firebase.ts wiring', () => {
  const firebase = readFileSync(resolve(__dirname, './firebase.ts'), 'utf8');

  it('imports firebase-applet-config.json instead of embedding apiKey in source', () => {
    expect(firebase).toMatch(/firebase-applet-config\.json/);
    expect(firebase).not.toMatch(/apiKey:\s*['"]/);
    expect(firebase).not.toMatch(/AIza/);
  });
});