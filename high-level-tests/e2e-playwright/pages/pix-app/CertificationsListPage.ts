import type { Page } from '@playwright/test';

import { CertificationResultPage } from './CertificationResultPage.ts';

export class CertificationsListPage {
  constructor(public readonly page: Page) {}

  async goToCertificationResult(certificationNumber: string) {
    const card = this.page.getByTestId(`pw-certification-card-${certificationNumber}`);
    await Promise.all([
      this.page.waitForURL(/\/mes-certifications\/\d+$/),
      card.getByRole('link', { name: 'Voir le détail' }).click(),
    ]);
    return new CertificationResultPage(this.page);
  }

  async getCertificationStatus(certificationNumber: string) {
    const card = this.page.getByTestId(`pw-certification-card-${certificationNumber}`);
    return await card.locator('.pix-tag').innerText();
  }
}
