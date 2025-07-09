import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(emailOrUsername: string, rawPassword: string) {
    await this.page.getByLabel('Adresse e-mail ou identifiant').fill(emailOrUsername);
    await this.page.getByLabel('Mot de passe').fill(rawPassword);
    await this.page.getByRole('button', { name: 'Je me connecte' }).click();
  }
}
