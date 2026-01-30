import { mergeTests } from '@playwright/test';

import { browserContextsFixtures } from './browser-contexts.ts';
import { snapshotFixtures } from './snapshot.ts';
import { utilsFixtures } from './utils.ts';

export const test = mergeTests(utilsFixtures, snapshotFixtures, browserContextsFixtures);

export const expect = test.expect;
