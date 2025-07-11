import { Page } from '@playwright/test';

export class PixOrgaPage {
  constructor(private readonly page: Page) {}

  async login(email: string, rawPassword: string) {
    await this.page.getByLabel('Adresse e-mail').fill(email);
    await this.page.getByLabel('Mot de passe').fill(rawPassword);

    await this.page.getByRole('button', { name: 'Je me connecte' }).click();
  }

  async acceptCGU() {
    await this.page.getByRole('button', { name: 'Accepter et continuer' }).click();
  }

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

  async createEvaluationCampaign({
    campaignName,
    targetProfileName,
  }: {
    campaignName: string;
    targetProfileName: string;
  }) {
    await this.page.getByLabel('Nom de la campagne *').fill(campaignName);
    await this.page.getByRole('radio', { name: 'Évaluer les participants' }).check();
    await this.page.getByRole('button', { name: 'Que souhaitez-vous tester ? *' }).click();
    await this.page.getByRole('option', { name: targetProfileName }).click();
    await this.page.getByRole('button', { name: 'Créer la campagne' }).click();
  }
}
