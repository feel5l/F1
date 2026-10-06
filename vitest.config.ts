import { defineConfig } from 'vitest/config';

/** Minimal config for unit tests on pure lib helpers (avoids pulling Vite React/Tailwind plugins). */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
