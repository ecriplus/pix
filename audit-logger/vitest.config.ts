import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default', process.env.CI ? 'junit' : {}],
    outputFile: process.env.CI ? './test-results/report.xml' : undefined,
    globals: true,
    clearMocks: true,
    watch: false,
    pool: 'threads',
    maxWorkers: 1,
    isolate: false,
  },
});
