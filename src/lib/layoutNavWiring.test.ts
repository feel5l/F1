import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { LAYOUT_NAV_ITEMS } from './layoutNav';

describe('Layout.tsx nav paths stay aligned with layoutNav', () => {
  const layout = readFileSync(resolve(__dirname, '../components/Layout.tsx'), 'utf8');

  it('lists every canonical nav path', () => {
    for (const item of LAYOUT_NAV_ITEMS) {
      expect(layout).toContain(`path: '${item.path}'`);
    }
  });
});