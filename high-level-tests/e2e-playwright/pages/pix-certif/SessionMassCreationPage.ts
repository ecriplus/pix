import path from 'node:path';

import type { Page } from '@playwright/test';
export class SessionMassCreationPage {
  constructor(public readonly page: Page) {}

  async importCsvFile(filePath: string) {
    await this.page.getByLabel('Importer le modèle complété').setInputFiles(filePath);
    const fileName = path.basename(filePath);
    await this.page.getByText(fileName).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Continuer' }).click();
    await this.page.getByText('Récapitulatif').waitFor({ state: 'visible' });
  }

  async finalize() {
    await this.page.getByRole('button', { name: 'Finaliser la création/édition' }).click();
  }
}
