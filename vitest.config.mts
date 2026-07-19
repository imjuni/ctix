/* eslint-disable import/no-default-export, import/no-extraneous-dependencies */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: 'v8', // or 'v8'
      all: false,
    },
    exclude: ['node_modules', 'examples'],
  },
});
