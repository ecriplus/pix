import type { Page } from '@playwright/test';

import { normalizeWhitespace } from '../../helpers/utils.ts';

export class CertificationResultPage {
  constructor(public readonly page: Page) {}

  async downloadCertificate() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByRole('button', { name: 'Télécharger mon certificat' }).click(),
    ]);
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
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
