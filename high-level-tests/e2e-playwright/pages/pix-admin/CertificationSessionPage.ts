import type { Page } from '@playwright/test';

import { getNumberValueFromDescriptionList, getStringValueFromDescriptionList } from '../../helpers/utils.ts';
import { CertificationListPage } from './index.ts';

export class CertificationSessionPage {
  constructor(public readonly page: Page) {}

  async getInfo() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/\d+$/);

    return {
      certificationCenter: await getStringValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Centre de certification',
      ),
      address: await getStringValueFromDescriptionList(this.page, 'pw-session-info-description-list', 'Nom du site'),
      room: await getStringValueFromDescriptionList(this.page, 'pw-session-info-description-list', 'Nom de la salle'),
      invigilatorName: await getStringValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Surveillant',
      ),
      status: await getStringValueFromDescriptionList(this.page, 'pw-session-info-description-list', 'Statut'),
      nbStartedCertifications: await getNumberValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Nombre de certification(s) démarrée(s)',
      ),
      nbIssueReportsUnsolved: await getNumberValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Nombre de signalement(s) impactant(s) non résolu(s)',
      ),
      nbIssueReports: await getNumberValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Nombre de signalement(s)',
      ),
      nbCertificationsInError: await getNumberValueFromDescriptionList(
        this.page,
        'pw-session-info-description-list',
        'Nombre de certification(s) en erreur',
      ),
    };
  }

  async goToCertificationListPage() {
    await this.page.getByRole('link', { name: 'Liste des certifications de la session', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/\d+\/certifications$/);

    return new CertificationListPage(this.page);
  }
}
