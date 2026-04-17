import type { Page } from '@playwright/test';
export class ReconciliationPage {
  constructor(public readonly page: Page) {}

  /**
   * Fill reconciation form
   * @param firstName
   * @param lastName
   * @param birthDate with dd/mm/yyyy format
   * @param withAssociation
   */
  async reconcile(firstName: string, lastName: string, birthDate: string, withAssociation: boolean) {
    await this.page.getByRole('textbox', { name: /Prénom/ }).fill(firstName);
    await this.page.getByRole('textbox', { name: /Nom/ }).fill(lastName);
    const [day, month, year] = birthDate.split('/');
    await this.page.getByRole('spinbutton', { name: 'jour de naissance' }).fill(day);
    await this.page.getByRole('spinbutton', { name: 'mois de naissance' }).fill(month);
    await this.page.getByRole('spinbutton', { name: 'année de naissance' }).fill(year);

    if (withAssociation) {
      await this.page.getByRole('button', { name: "C'est parti !" }).click();
      await this.page.getByRole('button', { name: 'Associer' }).click();
    } else {
      await this.page.getByRole('button', { name: "Je m'inscris" }).click();
    }
  }
}
