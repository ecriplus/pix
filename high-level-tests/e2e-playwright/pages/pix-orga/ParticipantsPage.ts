import type { Page } from '@playwright/test';
export class ParticipantsPage {
  constructor(public readonly page: Page) {}

  async goToParticipant(firstName: string) {
    await this.page
      .locator('table tbody tr', { has: this.page.getByText(firstName) })
      .getByRole('link')
      .click();
    await this.page.waitForURL(/\/participants\/\d+$/);
  }
}
