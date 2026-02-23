import type { Page } from '@playwright/test';

import { SessionCreationPage, SessionManagementPage, SessionMassCreationPage } from './index.ts';
export class SessionListPage {
  constructor(public readonly page: Page) {}

  async goToCreateSession() {
    await this.page.goto(process.env.PIX_CERTIF_URL as string);
    await this.page.getByRole('link', { name: 'Créer une session' }).click();
    await this.page.waitForURL('**/creation');

    return new SessionCreationPage(this.page);
  }

  async goToMassSessionCreationPage() {
    await this.page.goto(process.env.PIX_CERTIF_URL as string);
    await this.page.getByRole('link', { name: /Créer.*plusieurs sessions/i }).click();
    await this.page.waitForURL('**/sessions/import');

    return new SessionMassCreationPage(this.page);
  }

  async goToSession(uniqueIdentifier: string) {
    await this.page
      .locator('table tbody tr', { has: this.page.getByText(uniqueIdentifier) })
      .getByRole('link')
      .click();
    await this.page.waitForURL(/\/sessions\/\d+$/);

    return new SessionManagementPage(this.page);
  }
}
