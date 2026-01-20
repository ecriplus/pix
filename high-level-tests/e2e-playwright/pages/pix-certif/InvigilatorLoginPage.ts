import type { Page } from '@playwright/test';

import { InvigilatorOverviewPage } from './InvigilatorOverviewPage.ts';
export class InvigilatorLoginPage {
  constructor(public readonly page: Page) {}

  static async goto(page: Page) {
    await page.goto(process.env.PIX_CERTIF_URL + '/connexion-espace-surveillant');
    return new InvigilatorLoginPage(page);
  }

  async login(sessionNumber: string, invigilatorCode: string) {
    await this.page.getByLabel('Numéro de la session').fill(sessionNumber);
    await this.page.getByLabel('Mot de passe de la session').fill(invigilatorCode);
    await this.page.getByRole('button', { name: 'Surveiller la session' }).click();

    await this.page.waitForURL(/\/sessions\/\d+\/surveiller$/);
    return new InvigilatorOverviewPage(this.page);
  }
}
