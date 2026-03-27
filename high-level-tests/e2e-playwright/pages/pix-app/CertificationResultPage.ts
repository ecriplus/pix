import type { Page } from '@playwright/test';

import { getDownloadBuffer, normalizeWhitespace } from '../../helpers/utils.ts';

export class CertificationResultPage {
  constructor(public readonly page: Page) {}

  async downloadCertificate() {
    const downloadTrigger = this.page.getByRole('button', { name: 'Télécharger mon certificat' }).click();
    return getDownloadBuffer(this.page, downloadTrigger);
  }

  async getResultInfo() {
    await this.page.getByTestId('pw-candidate-certificate-pix-score').waitFor();
    const pixScoreRaw = await this.page.getByTestId('pw-candidate-certificate-pix-score').innerText();
    const globalLevelRaw = await Promise.race([
      this.page.getByTestId('pw-candidate-certificate-global-level').innerText(),
      this.page.getByTestId('pw-candidate-certificate-insufficient-global-level').innerText(),
    ]);
    const isCleaObtained = await this.page.getByText('Certification CléA Numérique by Pix').isVisible();
    return {
      pixScoreObtained: normalizeWhitespace(pixScoreRaw),
      pixLevelReached: normalizeWhitespace(globalLevelRaw),
      isCleaObtained,
    };
  }
}
