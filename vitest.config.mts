/* eslint-disable import/no-default-export, import/no-extraneous-dependencies */
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10_000,
    coverage: {
      provider: 'v8', // or 'v8'
      all: false,
    },
    exclude: ['node_modules', 'examples'],
  },
  plugins: [tsconfigPaths({ projects: ['tsconfig.json'] })],
});
