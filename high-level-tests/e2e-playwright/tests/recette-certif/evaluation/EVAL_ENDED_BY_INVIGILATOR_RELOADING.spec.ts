import { expect, test } from '../../../fixtures/certification/index.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkCertificationGeneralInformationAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../helpers/certification/utils.ts';
import { PIX_CERTIF_PRO_DATA } from '../../../helpers/db-data.ts';
import { HomePage as AdminHomePage } from '../../../pages/pix-admin/index.ts';
import { SessionManagementPage } from '../../../pages/pix-certif/index.ts';
import data from '../data.json' with { type: 'json' };

const testRef = 'EVAL_ENDED_BY_INVIGILATOR_RELOADING';

test.describe(testRef, () => {
  test.use({
    testRef,
    rightWrongAnswersSequence: Array(24).fill(true),
    candidateData: data.certifiableUser,
  });

  test(`${testRef} - User test is being ended by invigilator. User should be able to reach expected end of test page after reloading. Certification should be scorable`, async ({
    page: pixAppPage,
    preparedCertificationTest,
    pixSuperAdminContext,
  }) => {
    test.slow();

    const { sessionNumber, pixCertifPage, invigilatorOverviewPage } = preparedCertificationTest;

    await test.step('user stops at 25th challenge', async () => {
      await expect(pixAppPage.getByLabel('Votre progression')).toContainText('25 / 32');
    });

    await test.step('invigilator ends the certification test', async () => {
      await invigilatorOverviewPage.endCertificationTest(data.certifiableUser.firstName, data.certifiableUser.lastName);
    });

    await test.step('user reloads the page and reaches expected end of certification page', async () => {
      await pixAppPage.reload();
      await expect(pixAppPage.locator('h1')).toContainText('Test terminé !');
      await expect(
        pixAppPage.getByText(
          'Votre surveillant a mis fin à votre test de certification. Vous ne pouvez plus continuer de répondre aux questions.',
        ),
      ).toBeVisible();
    });

    await test.step('Finalization by marking a technical issue and check scoring', async () => {
      const sessionManagementPage = new SessionManagementPage(pixCertifPage);
      const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
      await expect(pixCertifPage.getByText(data.certifiableUser.firstName)).toBeVisible();
      await sessionFinalizationPage.markTechnicalIssueFor(data.certifiableUser.lastName);

      await sessionFinalizationPage.finalizeSession();
    });

    const pixAdminPage = await pixSuperAdminContext.newPage();
    await pixAdminPage.goto(process.env.PIX_ADMIN_URL as string);
    const adminHomepage = new AdminHomePage(pixAdminPage);

    await test.step('Check all session data', async () => {
      const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
      const sessionPage = await sessionsMainPage.goToSessionToPublishInfo(sessionNumber);

      await test.step('Check session information', async () => {
        await checkSessionInformationAndExpectSuccess(sessionPage, {
          certificationCenter:
            PIX_CERTIF_PRO_DATA.certificationCenters[0].externalId + PIX_CERTIF_PRO_DATA.certificationCenters[0].type,
          address: `address ${testRef}`,
          room: `room ${testRef}`,
          invigilatorName: `examiner ${testRef}`,
          status: 'Finalisée',
          nbStartedCertifications: 0,
          nbIssueReportsUnsolved: 0,
          nbIssueReports: 0,
          nbCertificationsInError: 0,
        });
      });

      await pixAdminPage.getByRole('link', { name: 'Liste des certifications de la session', exact: true }).click();
      await test.step('Check certification information', async () => {
        const certificationListPage = await sessionPage.goToCertificationListPage();
        const certificationData = await certificationListPage.getCertificationData();
        expect(certificationData.length).toBe(1);
        expect(certificationData[0]).toMatchObject({
          Prénom: data.certifiableUser.firstName,
          Nom: data.certifiableUser.lastName,
          Statut: 'Terminée par le surveillant',
          Score: '895',
          'Signalements impactants non résolus': '',
          'Certification passée': 'Certification Pix',
        });
        const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
          data.certifiableUser.firstName,
        );
        await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
          sessionNumber,
          status: 'Validée',
          score: '895 Pix',
        });
        await checkCertificationDetailsAndExpectSuccess(certificationInformationPage, {
          nbAnsweredQuestionsOverTotal: '24/32',
          nbQuestionsOK: 24,
          nbQuestionsKO: 0,
          nbQuestionsAband: 0,
          nbValidatedTechnicalIssues: 0,
          testEndedBy: 'Le surveillant',
          abortReason: 'Problème technique',
        });
      });
    });
  });
});
