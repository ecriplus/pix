import type { Page } from '@playwright/test';

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
}
