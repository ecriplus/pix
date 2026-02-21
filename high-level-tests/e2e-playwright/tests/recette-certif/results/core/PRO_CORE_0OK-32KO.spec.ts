import { expect, test } from '../../../../fixtures/certification/index.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkCertificationGeneralInformationAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../../helpers/certification/utils.ts';
import { HomePage as AdminHomePage } from '../../../../pages/pix-admin/index.ts';
import { HomePage } from '../../../../pages/pix-app/index.ts';
import { SessionManagementPage } from '../../../../pages/pix-certif/index.ts';
import data from '../../data.json' with { type: 'json' };

const testRef = 'PRO_CORE_0OK-32KO';
const snapshotPath = `recette-certif/${testRef}.json`;

test.describe(testRef, () => {
  test.use({
    testRef,
    rightWrongAnswersSequence: Array(32).fill(false),
    candidateData: data.certifiableUser,
  });

  test(
    `${testRef} - User takes a certification test for a PRO certification center, only CORE subscription. 32 wrong answers`,
    {
      tag: ['@snapshot'],
      annotation: [
        {
          type: 'tag',
          description: `@snapshot - this test runs against a reference snapshot. Snapshot can be generated with UPDATE_SNAPSHOTS=true
         Reasons why a snapshot could be re-generated :
         - Reference Release has changed
         - Next challenge algorithm has changed
         - Scoring algorithm or configuration has changed`,
        },
      ],
    },
    async ({
      page: pixAppPage,
      pixCertifProPage,
      preparedCertificationTest,
      pixAdminRoleCertifPage,
      snapshotHandler,
    }) => {
      test.slow();

      let certificationNumber = '';
      const { sessionNumber } = preparedCertificationTest;

      await test.step(`reaches end of certification test`, async () => {
        await expect(pixAppPage.locator('h1')).toContainText('Test terminé !');
        await expect(pixAppPage.locator('h2')).toContainText(
          'Vos résultats, en attente de validation par les équipes Pix, seront bientôt disponibles sur votre compte Pix',
        );
      });
      await pixAppPage.waitForTimeout(2000); // BEURK, attendre que le scoring soit bien passé

      await test.step('Finalization and scoring', async () => {
        const sessionManagementPage = new SessionManagementPage(pixCertifProPage);
        const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
        await expect(pixCertifProPage.getByText(data.certifiableUser.firstName)).toBeVisible();

        await sessionFinalizationPage.finalizeSession();
      });

      const adminHomepage = new AdminHomePage(pixAdminRoleCertifPage);

      await test.step('Check all session data', async () => {
        const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
        const sessionPage = await sessionsMainPage.goToSessionToPublishInfo(sessionNumber);

        await test.step('Check session information', async () => {
          await checkSessionInformationAndExpectSuccess(sessionPage, {
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

        await pixAdminRoleCertifPage
          .getByRole('link', { name: 'Liste des certifications de la session', exact: true })
          .click();
        await test.step('Check certification information', async () => {
          const certificationListPage = await sessionPage.goToCertificationListPage();
          const certificationData = await certificationListPage.getCertificationData();
          expect(certificationData.length).toBe(1);
          expect(certificationData[0]).toMatchObject({
            Prénom: data.certifiableUser.firstName,
            Nom: data.certifiableUser.lastName,
            Statut: 'Rejetée',
            Score: '0',
            'Signalements impactants non résolus': '',
            'Certification passée': 'Certification Pix',
          });
          const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
            data.certifiableUser.firstName,
          );
          certificationNumber = certificationInformationPage.getCertificationNumber();
          await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
            sessionNumber,
            status: 'Rejetée',
            score: '0 Pix',
          });
          await checkCertificationDetailsAndExpectSuccess(certificationInformationPage, {
            nbAnsweredQuestionsOverTotal: '32/32',
            nbQuestionsOK: 0,
            nbQuestionsKO: 32,
            nbQuestionsAband: 0,
            nbValidatedTechnicalIssues: 0,
          });
        });
      });

      await test.step('Publish session', async () => {
        const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
        await sessionsMainPage.publishSession(sessionNumber);
      });

      await test.step('User checks their certification result', async () => {
        await pixAppPage.goto(process.env.PIX_APP_URL as string);
        const homePage = new HomePage(pixAppPage);
        const certificationsListPage = await homePage.goToMyCertifications();
        const status = await certificationsListPage.getCertificationStatus(certificationNumber);
        expect(status).toBe('Non-obtenue');
      });
      await snapshotHandler.expectOrRecord(snapshotPath);
    },
  );
});
