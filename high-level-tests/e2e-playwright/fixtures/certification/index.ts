import { mergeTests } from '@playwright/test';

import { preparedCertificationTestFixtures } from './prepared-certification-test.ts';

export const test = mergeTests(preparedCertificationTestFixtures);

export const expect = test.expect;
