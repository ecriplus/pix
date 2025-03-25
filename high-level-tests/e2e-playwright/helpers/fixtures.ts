import { test as base } from '@playwright/test';

import { cleanDB } from './db.js';

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await cleanDB();
      await use();
    },
    { auto: true },
  ],
});
