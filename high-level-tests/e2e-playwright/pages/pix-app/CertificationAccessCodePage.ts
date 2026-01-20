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
}
