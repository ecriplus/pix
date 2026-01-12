import type { Page } from '@playwright/test';

import { CertificationStartPage } from './index.ts';
export class HomePage {
  constructor(public readonly page: Page) {}

  async goToStartCertification() {
    await this.page.getByRole('link', { name: 'Certification' }).click();
    await this.page.waitForURL(/\/certifications$/);

    return new CertificationStartPage(this.page);
  }

  async goToMyCertifications() {
    await this.page.getByRole('button', { name: /Consulter mes informations/ }).click();
    await this.page.getByRole('link', { name: 'Mes certifications' }).click();
    await this.page.waitForURL(/\/mes-certifications$/);

    return new CertificationStartPage(this.page);
  }
}
