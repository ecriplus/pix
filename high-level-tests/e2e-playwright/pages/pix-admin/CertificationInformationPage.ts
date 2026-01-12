import type { Page } from '@playwright/test';

import { getNumberValueFromDescriptionList, getStringValueFromDescriptionList } from '../../helpers/utils.ts';
export class CertificationInformationPage {
  constructor(public readonly page: Page) {}

  async getGeneralInfo() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    return {
      sessionNumber: await getStringValueFromDescriptionList(
        this.page,
        'certification-state-description-list',
        'Session',
      ),
      status: await getStringValueFromDescriptionList(this.page, 'certification-state-description-list', 'Statut'),
      score: await getStringValueFromDescriptionList(this.page, 'certification-state-description-list', 'Score'),
    };
  }

  async getDetails() {
    await this.page.getByRole('link', { name: 'Détails', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+\/details$/);
    return {
      nbAnsweredQuestionsOverTotal: await getStringValueFromDescriptionList(
        this.page,
        'certification-more-information-description-list',
        'Nombre de question répondues / Nombre total de questions',
      ),
      nbQuestionsOK: await getNumberValueFromDescriptionList(
        this.page,
        'certification-more-information-description-list',
        'Nombre de question OK :',
      ),
      nbQuestionsKO: await getNumberValueFromDescriptionList(
        this.page,
        'certification-more-information-description-list',
        'Nombre de question KO :',
      ),
      nbQuestionsAband: await getNumberValueFromDescriptionList(
        this.page,
        'certification-more-information-description-list',
        'Nombre de question abandonnées :',
      ),
      nbValidatedTechnicalIssues: await getNumberValueFromDescriptionList(
        this.page,
        'certification-more-information-description-list',
        'Nombre de problèmes techniques validés :',
      ),
    };
  }
}
