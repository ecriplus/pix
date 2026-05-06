import type { Page } from '@playwright/test';

import { ChallengePage } from './ChallengePage.ts';
export class CertificationAccessCodePage {
  constructor(public readonly page: Page) {}

  async fillAccessCodeAndStartCertificationTest(accessCode: string) {
    await this.page.getByLabel("Code d'accès communiqué").fill(accessCode);
    await this.page.getByRole('button', { name: 'Commencer mon test' }).click();
    await this.page.waitForURL(/\/assessments\/\d+\/challenges\/\d+$/);

    return new ChallengePage(this.page);
  }

  async fillAccessCodeWithLocaleAndStartCertificationTest(
    chosenLocale: 'anglais - EN' | 'français - FR',
    accessCode: string,
  ) {
    await this.page.getByRole('button', { name: 'Langue de certification' }).click();
    await this.page.getByRole('option', { name: chosenLocale }).click();
    const languageConfirmationCheckbox = this.page.getByRole('checkbox', {
      name: /Je confirme être à l'aise dans la langue sélectionnée/,
    });
    if (await languageConfirmationCheckbox.isVisible()) {
      await languageConfirmationCheckbox.click();
    }
    await this.page.getByLabel("Code d'accès communiqué").fill(accessCode);
    await this.page.getByRole('button', { name: 'Commencer mon test' }).click();
    await this.page.waitForURL(/\/assessments\/\d+\/challenges\/\d+$/);

    return new ChallengePage(this.page);
  }
}
