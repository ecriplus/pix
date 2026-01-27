import type { Page } from '@playwright/test';

import { UserDetailsPage } from './UserDetailsPage.ts';

export class UsersListPage {
  constructor(public readonly page: Page) {}

  async goToUserDetails(firstName: string, email: string) {
    await this.page.getByLabel('Prénom').fill(firstName);
    await this.page.getByRole('button', { name: 'Charger' }).click();

    await this.page.getByText(email).waitFor({ state: 'visible' });

    await this.page
      .locator('table tbody tr', { has: this.page.getByText(firstName) })
      .getByRole('link')
      .click();
    await this.page.waitForURL(/\/users\/\d+$/);

    return new UserDetailsPage(this.page);
  }
}
