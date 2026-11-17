import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/** Regression guard for fix/security: no client-side secret injection via Vite define. */
describe('vite.config.ts client bundle safety', () => {
  const source = readFileSync(resolve(__dirname, '../../vite.config.ts'), 'utf8');

  it('does not embed GEMINI_API_KEY or loadEnv into the frontend build', () => {
    expect(source).not.toMatch(/GEMINI_API_KEY/);
    expect(source).not.toMatch(/loadEnv/);
    expect(source).not.toMatch(/define:\s*\{/);
  });
});