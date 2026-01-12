import type { Page } from '@playwright/test';

import { CertificationSessionPage } from './index.ts';

export class CertificationSessionsMainPage {
  constructor(public readonly page: Page) {}

  async goToSessionToPublishInfo(sessionNumber: string) {
    await this.page.getByRole('link', { name: /V3 — Sessions à publier/ }).click();
    await this.page.waitForURL(/\/sessions\/list\/to-be-published\?version=3$/);

    await this.page.getByRole('link', { name: sessionNumber, exact: true }).click();
    await this.page.waitForURL(/\/sessions\/\d+$/);

    return new CertificationSessionPage(this.page);
  }

  async publishSession(sessionNumber: string) {
    await this.page.getByRole('link', { name: /V3 — Sessions à publier/ }).click();
    await this.page.waitForURL(/\/sessions\/list\/to-be-published\?version=3$/);
    await this.page.getByRole('button', { name: `Publier la session numéro ${sessionNumber}` }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();
    const row = this.page.locator('table tbody tr').filter({
      has: this.page.getByText(sessionNumber, { exact: true }),
    });
    await row.waitFor({ state: 'detached' });
  }
}
