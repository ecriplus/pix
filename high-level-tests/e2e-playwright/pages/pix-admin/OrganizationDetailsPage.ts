import type { Page } from '@playwright/test';

export class OrganizationDetailsPage {
  constructor(public readonly page: Page) {}
  async goToCampaign(campaignName: string) {
    await this.page.getByRole('link', { name: 'Campagnes' }).click();
    await this.page.waitForURL(/organizations\/\d+\/campaigns/);

    await this.page.getByRole('link', { name: campaignName }).click();
    await this.page.waitForURL(/campaigns\/\d+\/participations/);
  }
}
