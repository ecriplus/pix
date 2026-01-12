import type { Page } from '@playwright/test';

import { SessionCreationPage } from './index.ts';
export class SessionListPage {
  constructor(public readonly page: Page) {}

  async goToCreateSession() {
    await this.page.goto(process.env.PIX_CERTIF_URL as string);
    await this.page.getByRole('link', { name: 'Créer une session' }).click();
    await this.page.waitForURL('**/creation');

    return new SessionCreationPage(this.page);
  }
}
