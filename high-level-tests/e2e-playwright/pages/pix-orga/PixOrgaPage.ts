import { Page } from '@playwright/test';

export class PixOrgaPage {
  constructor(private readonly page: Page) {}

  async selectOrganization(organizationName: string) {
    await this.page.getByRole('button', { name: "Changer d'organisation" }).click();
    await this.page.getByRole('option', { name: organizationName }).click();
  }

  async waitForUploadSuccess(page: Page) {
    let inProgress = false;
    await page.getByRole('heading').waitFor();
    do {
      await page.reload({ waitUntil: 'load' });
      await page.getByRole('heading').waitFor();
      inProgress = await page.getByRole('paragraph').filter({ hasText: 'un import est en cours' }).isVisible();
    } while (inProgress);
  }
}
