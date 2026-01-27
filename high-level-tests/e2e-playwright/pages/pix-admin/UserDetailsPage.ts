import type { Page } from '@playwright/test';

export class UserDetailsPage {
  constructor(public readonly page: Page) {}
  async anonymize() {
    await this.page.getByRole('button', { name: 'Anonymiser cet utilisateur' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();
  }
}
