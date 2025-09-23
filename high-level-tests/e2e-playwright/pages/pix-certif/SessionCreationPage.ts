import { Page } from '@playwright/test';

export class SessionCreationPage {
  constructor(private readonly page: Page) {}

  async createSession({
    address,
    room,
    examiner,
    hour,
    minute,
  }: {
    address: string;
    room: string;
    examiner: string;
    hour: string;
    minute: string;
  }) {
    await this.page.getByLabel('Nom du site').fill(address);
    await this.page.getByLabel('Nom de la salle').fill(room);

    const today = new Date().toISOString().split('T')[0];
    await this.page.getByLabel('Date de début *').fill(today);

    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    await this.page.getByLabel('Heure de début (heure locale) *').fill(time);

    await this.page.getByLabel('Surveillant(s)').fill(examiner);
    await this.page.getByRole('button', { name: 'Créer la session' }).click();
  }
}
