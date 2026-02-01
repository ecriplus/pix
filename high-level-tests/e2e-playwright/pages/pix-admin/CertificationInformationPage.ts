import type { Page } from '@playwright/test';

import { getNumberValueFromDescriptionList, getStringValueFromDescriptionList } from '../../helpers/utils.ts';

export class CertificationInformationPage {
  constructor(public readonly page: Page) {}

  getCertificationNumber() {
    const match = this.page.url().match(/\/sessions\/certification\/(\d+)/);
    if (!match) throw new Error('Certification id not found in URL');
    return match[1];
  }

  async getGeneralInfo() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    return {
      sessionNumber: await getStringValueFromDescriptionList(
        this.page,
        'pw-certification-state-description-list',
        'Session',
      ),
      status: await getStringValueFromDescriptionList(this.page, 'pw-certification-state-description-list', 'Statut'),
      score: await getStringValueFromDescriptionList(this.page, 'pw-certification-state-description-list', 'Score'),
    };
  }

  async getDetails() {
    await this.page.getByRole('link', { name: 'Détails', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+\/details$/);
    return {
      nbAnsweredQuestionsOverTotal: await getStringValueFromDescriptionList(
        this.page,
        'pw-certification-more-information-description-list',
        'Nombre de question répondues / Nombre total de questions',
      ),
      nbQuestionsOK: await getNumberValueFromDescriptionList(
        this.page,
        'pw-certification-more-information-description-list',
        'Nombre de question OK :',
      ),
      nbQuestionsKO: await getNumberValueFromDescriptionList(
        this.page,
        'pw-certification-more-information-description-list',
        'Nombre de question KO :',
      ),
      nbQuestionsAband: await getNumberValueFromDescriptionList(
        this.page,
        'pw-certification-more-information-description-list',
        'Nombre de question abandonnées :',
      ),
      nbValidatedTechnicalIssues: await getNumberValueFromDescriptionList(
        this.page,
        'pw-certification-more-information-description-list',
        'Nombre de problèmes techniques validés :',
      ),
      testEndedBy: await getStringValueFromDescriptionList(
        this.page,
        'pw-certification-general-information-description-list',
        'Certification terminée par :',
        { optional: true },
      ),
      abortReason: await getStringValueFromDescriptionList(
        this.page,
        'pw-certification-general-information-description-list',
        "Raison de l'abandon :",
        { optional: true },
      ),
    };
  }

  async getCleaResult() {
    return getStringValueFromDescriptionList(
      this.page,
      'pw-certification-information-complementary',
      'CléA Numérique',
      { optional: true },
    );
  }

  async cancelCertification() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    await this.page.getByRole('button', { name: 'Annuler la certification' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.getByText('Désannuler la certification').waitFor({ state: 'visible' });
  }

  async uncancelCertification() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    await this.page.getByRole('button', { name: 'Désannuler la certification' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.getByText('Annuler la certification').waitFor({ state: 'visible' });
  }

  async rejectCertification() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    await this.page.getByRole('button', { name: 'Rejeter la certification' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.getByText('Annuler le rejet').waitFor({ state: 'visible' });
    await this.page
      .getByText(
        'Une situation de fraude a été détectée : après analyse, nous avons statué sur un rejet de la certification.',
      )
      .waitFor({ state: 'visible' });
  }

  async unrejectCertification() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    await this.page.getByRole('button', { name: 'Annuler le rejet' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.getByText('Rejeter la certification').waitFor({ state: 'visible' });
    await this.page
      .getByText(
        'Une situation de fraude a été détectée : après analyse, nous avons statué sur un rejet de la certification.',
      )
      .waitFor({ state: 'detached' });
  }

  async rescoreCertification() {
    await this.page.getByRole('link', { name: 'Informations', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/certification\/\d+$/);
    await this.page.getByRole('button', { name: 'Re-scorer la certification' }).click();

    await this.page.getByText('La certification a bien été rescorée').waitFor({ state: 'visible' });
  }
}
