import { mergeTests } from '@playwright/test';

import { certifSetupFixtures } from './certif-setup.ts';
import { snapshotRefsFixtures } from './snapshot-refs.ts';

export const test = mergeTests(certifSetupFixtures, snapshotRefsFixtures);

export const expect = test.expect;
