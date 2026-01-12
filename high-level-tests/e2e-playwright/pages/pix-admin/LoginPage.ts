import type { Page } from '@playwright/test';

import { HomePage } from './index.ts';
export class LoginPage {
  constructor(public readonly page: Page) {}

  async login(email: string, rawPassword: string) {
    await this.page.getByLabel('Adresse e-mail').fill(email);
    await this.page.getByLabel('Mot de passe').fill(rawPassword);

    await this.page.getByRole('button', { name: 'Je me connecte' }).click();
    await this.page.waitForURL(/\/organizations\/list$/);

    return new HomePage(this.page);
  }
}
