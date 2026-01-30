import path from 'node:path';

import { test as base } from '@playwright/test';
import crypto from 'crypto';

const shouldRecordHAR = process.env.RECORD_HAR === 'true';
const HAR_DIR = path.resolve(import.meta.dirname, '../.har-record');
export const utilsFixtures = base.extend<{
  globalTestId: string;
  forEachTest: void;
}>({
  // eslint-disable-next-line no-empty-pattern
  globalTestId: async ({}, use, testInfo) => {
    const raw = `${testInfo.file}::${testInfo.title}`;
    const hash = crypto.createHash('sha1').update(raw).digest('hex');
    await use(hash);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
  context: async ({ browser }, use, testInfo) => {
    const harFilePath = path.join(HAR_DIR, `${sanitizeFilename(testInfo.title)}-defaultContext.har`);
    const context = await browser.newContext(
      shouldRecordHAR
        ? {
            recordHar: {
              path: harFilePath,
              content: 'omit',
            },
          }
        : {},
    );
    await use(context);
    await context.close();
  },
});

function sanitizeFilename(name: string) {
  return name.replace(/[^a-z0-9_\-.]/gi, '_');
}
