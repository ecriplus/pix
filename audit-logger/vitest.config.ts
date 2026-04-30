import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: process.env.CI ? 'junit' : 'default',
    outputFile: process.env.CI ? './test-results/report.xml' : undefined,
    globals: true,
    clearMocks: true,
    watch: false,
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
  },
});
