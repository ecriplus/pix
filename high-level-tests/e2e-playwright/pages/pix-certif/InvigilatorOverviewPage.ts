import type { Page } from '@playwright/test';
export class InvigilatorOverviewPage {
  constructor(public readonly page: Page) {}

  async authorizeCandidateToStart(firstName: string, lastName: string) {
    await this.page
      .getByRole('button', {
        name: `Confirmer la présence de l'élève ${firstName} ${lastName}`,
      })
      .click();
    await this.page.getByText('1/1 candidat présent').waitFor({ state: 'visible' });
  }

  async endCertificationTest(firstName: string, lastName: string) {
    await this.page
      .getByRole('button', {
        name: 'Afficher les options du candidat',
      })
      .click();
    await this.page
      .getByRole('button', {
        name: 'Terminer le test',
      })
      .click();
    const modal = this.page.getByRole('dialog', { name: `Terminer le test de ${firstName} ${lastName}` });
    await modal.getByRole('button', { name: 'Terminer le test' }).click();

    await this.page
      .getByText(`Succès ! Le test de ${firstName} ${lastName} est terminé.`)
      .waitFor({ state: 'visible' });
  }
}
