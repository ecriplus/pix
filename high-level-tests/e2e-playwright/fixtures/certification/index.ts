import { mergeTests } from '@playwright/test';

import { certifSetupFixtures } from './certif-setup.ts';

export const test = mergeTests(certifSetupFixtures);

export const expect = test.expect;
