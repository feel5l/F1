import { describe, it, expect } from 'vitest';
import {
  mustRedirectUnauthenticatedToLogin,
  resolveAuthRoute,
  SMOKE_PROTECTED_PATHS,
} from './authRouting';

describe('resolveAuthRoute', () => {
  it('waits while auth is loading', () => {
    expect(resolveAuthRoute('/', false, true)).toBe('loading');
  });

  it('shows login for guests on /login', () => {
    expect(resolveAuthRoute('/login', false, false)).toBe('show-login');
  });

  it('sends signed-in users away from /login', () => {
    expect(resolveAuthRoute('/login', true, false)).toBe('redirect-to-home');
  });

  it('redirects guests from protected shell to login', () => {
    expect(resolveAuthRoute('/', false, false)).toBe('redirect-to-login');
    expect(resolveAuthRoute('/attendance', false, false)).toBe('redirect-to-login');
  });

  it('allows authenticated users into the app shell', () => {
    expect(resolveAuthRoute('/reports', true, false)).toBe('show-app');
  });

  it('treats /login subpaths like the login route', () => {
    expect(resolveAuthRoute('/login/', false, false)).toBe('show-login');
    expect(resolveAuthRoute('/login/oauth', true, false)).toBe('redirect-to-home');
  });

  it('blocks login and shell via loading while auth session is resolving', () => {
    for (const hasUser of [true, false]) {
      expect(resolveAuthRoute('/login', hasUser, true)).toBe('loading');
    }
    for (const path of SMOKE_PROTECTED_PATHS) {
      expect(resolveAuthRoute(path, false, true)).toBe('loading');
      expect(resolveAuthRoute(path, true, true)).toBe('loading');
    }
  });
});

describe('mustRedirectUnauthenticatedToLogin', () => {
  it('matches Playwright smoke protected routes', () => {
    for (const path of SMOKE_PROTECTED_PATHS) {
      expect(mustRedirectUnauthenticatedToLogin(path)).toBe(true);
    }
  });

  it('does not require redirect on login page', () => {
    expect(mustRedirectUnauthenticatedToLogin('/login')).toBe(false);
    expect(mustRedirectUnauthenticatedToLogin('/login/callback')).toBe(false);
  });
});