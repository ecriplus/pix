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
}
