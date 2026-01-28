import { mergeTests } from '@playwright/test';

import { sharedFixtures } from './shared.ts';
import { snapshotFixtures } from './snapshot.ts';

export const test = mergeTests(sharedFixtures, snapshotFixtures);

export const expect = test.expect;
