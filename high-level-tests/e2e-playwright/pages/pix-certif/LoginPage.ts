import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(email: string, rawPassword: string) {
    await this.page.getByLabel('Adresse e-mail').fill(email);
    await this.page.getByLabel('Mot de passe').fill(rawPassword);

    await this.page.getByRole('button', { name: 'Je me connecte' }).click();
  }

  async acceptCGU() {
    await this.page.getByRole('button', { name: 'J’accepte les conditions d’utilisation' }).click();
  }
}
