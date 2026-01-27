import type { Page } from '@playwright/test';

import { CertificationSessionsMainPage } from './index.ts';
export class HomePage {
  constructor(public readonly page: Page) {}

  async goToCertificationSessionsTab() {
    await this.page.getByRole('link', { name: 'Sessions de certification', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/list\/with-required-action\?version=3$/);

    return new CertificationSessionsMainPage(this.page);
  }
}
