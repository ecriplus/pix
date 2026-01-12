import type { Page } from '@playwright/test';

import { getNumberValueFromDescriptionList, getStringValueFromDescriptionList } from '../../helpers/utils.ts';
import { CertificationInformationPage } from './CertificationInformationPage.ts';
export class CertificationSessionPage {
  constructor(public readonly page: Page) {}

  async getInfo() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/\d+$/);

    return {
      certificationCenter: await getStringValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Centre de certification',
      ),
      address: await getStringValueFromDescriptionList(this.page, 'session-info-description-list', 'Nom du site'),
      room: await getStringValueFromDescriptionList(this.page, 'session-info-description-list', 'Nom de la salle'),
      invigilatorName: await getStringValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Surveillant',
      ),
      status: await getStringValueFromDescriptionList(this.page, 'session-info-description-list', 'Statut'),
      nbStartedCertifications: await getNumberValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Nombre de certification(s) démarrée(s)',
      ),
      nbIssueReportsUnsolved: await getNumberValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Nombre de signalement(s) impactant(s) non résolu(s)',
      ),
      nbIssueReports: await getNumberValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Nombre de signalement(s)',
      ),
      nbCertificationsInError: await getNumberValueFromDescriptionList(
        this.page,
        'session-info-description-list',
        'Nombre de certification(s) en erreur',
      ),
    };
  }

  async goToCertificationInfoPage(candidateFirstName: string) {
    await this.page.getByRole('link', { name: 'Liste des certifications de la session', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/\d+\/certifications$/);

    await this.page
      .locator('table tbody tr', { has: this.page.getByText(candidateFirstName) })
      .getByRole('link')
      .click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);

    return new CertificationInformationPage(this.page);
  }
}
