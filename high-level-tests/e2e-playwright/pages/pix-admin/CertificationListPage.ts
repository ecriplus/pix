import type { Page } from '@playwright/test';

import { CertificationInformationPage } from './index.ts';

export class CertificationListPage {
  constructor(public readonly page: Page) {}

  async goToCertificationInfoPage(candidateFirstName: string) {
    await this.page
      .locator('table tbody tr', { has: this.page.getByText(candidateFirstName) })
      .getByRole('link')
      .click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);

    return new CertificationInformationPage(this.page);
  }

  async getCertificationData() {
    const table = this.page.locator('table');
    const headers = await table.locator('thead th').allTextContents();
    const rows = await table.locator('tbody tr').all();

    const results = [];

    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      const rowObject: Record<string, string> = {};

      for (let i = 0; i < headers.length; i++) {
        const columnName = headers[i].trim();
        rowObject[columnName] = cells[i]?.trim() || '';
      }
      results.push(rowObject);
    }

    return results;
  }
}
