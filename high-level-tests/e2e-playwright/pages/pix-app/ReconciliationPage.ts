import { Page } from '@playwright/test';

export class ReconciliationPage {
  constructor(private readonly page: Page) {}

  /**
   * Fill reconciation form
   * @param firstName
   * @param lastName
   * @param birthDate with dd/mm/yyyy format
   */
  async reconcile(firstName: string, lastName: string, birthDate: string) {
    await this.page.getByRole('textbox', { name: 'Prénom' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Nom', exact: true }).fill(lastName);
    const [day, month, year] = birthDate.split('/');
    await this.page.getByRole('textbox', { name: 'jour de naissance' }).fill(day);
    await this.page.getByRole('textbox', { name: 'mois de naissance' }).fill(month);
    await this.page.getByRole('textbox', { name: 'année de naissance' }).fill(year);
    await this.page.getByRole('button', { name: "C'est parti !" }).click();
    await this.page.getByRole('button', { name: 'Associer' }).click();
  }
}
