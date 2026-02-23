import { mergeTests } from '@playwright/test';

import { loggedPagesFixtures } from './logged-pages.ts';

export const baseCertifTest = mergeTests(loggedPagesFixtures);

export const expect = baseCertifTest.expect;
