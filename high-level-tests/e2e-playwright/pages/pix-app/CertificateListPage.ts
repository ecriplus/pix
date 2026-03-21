import type { Page } from '@playwright/test';

import { getInnerTextOrDefault, normalizeWhitespace } from '../../helpers/utils.ts';
import { CertificationResultPage } from './CertificationResultPage.ts';

export class CertificateListPage {
  constructor(public readonly page: Page) {}

  async goToCertificateDetails(certificationNumber: string) {
    const card = this.page.getByTestId(`pw-certification-card-${certificationNumber}`);
    await Promise.all([
      this.page.waitForURL(/\/mes-certifications\/\d+$/),
      card.getByRole('link', { name: 'Voir le détail' }).click(),
    ]);
    return new CertificationResultPage(this.page);
  }

  async getCertificateData(certificationNumber: string) {
    const card = this.page.getByTestId(`pw-certification-card-${certificationNumber}`);

    const mainStatus = await card.getByTestId('pw-certification-card-main-status').innerText();
    const extraStatus = await getInnerTextOrDefault(card.getByTestId('pw-certification-card-extra-status'), null);
    const detailsFramework = await getInnerTextOrDefault(
      card.getByTestId('pw-certification-card-details-framework'),
      null,
    );
    const certificationCenter = await card.getByTestId('pw-certification-card-certification-center').innerText();
    const examDate = await card.getByTestId('pw-certification-card-exam-date').innerText();
    const result = await card.getByTestId('pw-certification-card-result').innerText();
    const comment = await getInnerTextOrDefault(card.getByTestId('pw-certification-card-comment'), null);

    return {
      mainStatus: normalizeWhitespace(mainStatus),
      extraStatus: extraStatus ? normalizeWhitespace(extraStatus) : null,
      detailsFramework: detailsFramework ? normalizeWhitespace(detailsFramework) : null,
      certificationCenter: normalizeWhitespace(certificationCenter),
      examDate: normalizeWhitespace(examDate),
      result: normalizeWhitespace(result),
      comment: comment ? normalizeWhitespace(comment) : null,
    };
  }
}
