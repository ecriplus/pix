import type { Page } from '@playwright/test';
export class FinalCheckpointPage {
  constructor(public readonly page: Page) {}

  async goToResults() {
    const currentUrl = this.page.url();
    await Promise.all([
      this.page.waitForURL((url) => url.toString() !== currentUrl),
      this.page.getByRole('link', { name: 'Voir mes résultats' }).first().click(),
    ]);
    const hasLoader = await this.page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await this.page.waitForSelector('.app-loader', { state: 'detached' });
    }
  }
}
