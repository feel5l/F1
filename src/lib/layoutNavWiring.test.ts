import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { NAV_ROUTE_ACCESS } from './navAccess';

const layoutPath = resolve(__dirname, '../components/Layout.tsx');

/** Regression guard: sidebar RBAC must stay centralized in navAccess (not inline on main). */
describe('Layout.tsx navigation wiring', () => {
  const source = readFileSync(layoutPath, 'utf8');

  it('uses shared nav and role helpers instead of duplicating access matrices', () => {
    expect(source).toMatch(/from '\.\.\/lib\/navAccess'/);
    expect(source).toMatch(/NAV_ROUTE_ACCESS/);
    expect(source).toMatch(/visibleNavPathsForRole/);
    expect(source).toMatch(/from '\.\.\/lib\/roleAccess'/);
    expect(source).toMatch(/resolveEffectiveRole/);
    expect(source).toMatch(/getRoleLabel/);
  });

  it('does not embed per-route role string arrays in the sidebar definition', () => {
    expect(source).not.toMatch(/roles:\s*\['ADMIN',\s*'TEACHER'/);
    expect(source).not.toMatch(/item\.roles\.includes/);
  });

  it('filters visibility via visibleNavPathsForRole(currentRole)', () => {
    expect(source).toMatch(/visibleNavPathsForRole\(currentRole\)/);
    expect(source).toMatch(/allowedPaths\.has\(item\.path\)/);
  });
});

describe('Layout nav destinations vs NAV_ROUTE_ACCESS', () => {
  const source = readFileSync(layoutPath, 'utf8');

  it('lists the same route paths as the shared access matrix', () => {
    const pathsInLayout = [...source.matchAll(/path:\s*'([^']+)'/g)]
      .map((m) => m[1])
      .filter((p) => p.startsWith('/'));
    const fromMatrix = NAV_ROUTE_ACCESS.map((r) => r.path).sort();
    expect([...new Set(pathsInLayout)].sort()).toEqual(fromMatrix);
  });
});