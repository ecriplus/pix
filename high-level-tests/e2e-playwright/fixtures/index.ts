import { mergeTests } from '@playwright/test';

import { browserContextsFixtures } from './browser-contexts.ts';
import { test as preparedCertificationTestFixtures } from './certification/prepared-certification-test.ts';
import { snapshotFixtures } from './snapshot.ts';
import { utilsFixtures } from './utils.ts';

export const test = mergeTests(
  utilsFixtures,
  snapshotFixtures,
  browserContextsFixtures,
  preparedCertificationTestFixtures,
);

export const expect = test.expect;
