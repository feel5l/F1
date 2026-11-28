import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

/**
 * Guards merged Playwright smoke intent (PR #3): login UI must stay testable without credentials.
 */
describe('e2e smoke login UI (PR #3)', () => {
  const smoke = readFileSync(resolve(__dirname, '../../e2e/smoke_test.py'), 'utf8');

  it('asserts unauthenticated users land on login', () => {
    expect(smoke).toMatch(/Expected redirect to \/login when unauthenticated/);
  });

  it('exercises Google login and password reset affordances', () => {
    expect(smoke).toMatch(/الدخول السريع عبر حساب جوجل/);
    expect(smoke).toMatch(/نسيت كلمة المرور/);
    expect(smoke).toMatch(/#resetEmail/);
    expect(smoke).toMatch(/#email/);
    expect(smoke).toMatch(/#password/);
  });

  it('fails the run when console or page errors are detected', () => {
    expect(smoke).toMatch(/page_errors|console_errors/);
    expect(smoke).toMatch(/return 2/);
  });
});