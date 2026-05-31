import { describe, it, expect } from 'vitest';
import { normalizeGhiyabiIdentifier } from './lib/authIdentifiers';

describe('test harness', () => {
  it('loads project modules', () => {
    expect(normalizeGhiyabiIdentifier('demo')).toContain('@ghiabi.com');
  });
});
