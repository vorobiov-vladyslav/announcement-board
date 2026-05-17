import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    pool: 'forks',
    forks: {
      singleFork: true,
    },
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 30000,
  },
});
