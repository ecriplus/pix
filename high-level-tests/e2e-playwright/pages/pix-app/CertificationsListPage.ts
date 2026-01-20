import type { Page } from '@playwright/test';

import { CertificationResultPage } from './CertificationResultPage.ts';

export class CertificationsListPage {
  constructor(public readonly page: Page) {}

  async goToCertificationResult(certificationNumber: string) {
    await this.page.locator(`a[href="/mes-certifications/${certificationNumber}"]`).click();
    return new CertificationResultPage(this.page);
  }
}
