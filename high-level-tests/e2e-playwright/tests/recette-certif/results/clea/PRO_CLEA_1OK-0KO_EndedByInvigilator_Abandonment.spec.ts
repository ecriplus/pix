import { expect, test } from '../../../../fixtures/certification/index.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkCertificationGeneralInformationAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../../helpers/certification/utils.ts';
import { CERTIFICATIONS_DATA } from '../../../../helpers/db-data.ts';
import { HomePage as AdminHomePage } from '../../../../pages/pix-admin/index.ts';
import { HomePage } from '../../../../pages/pix-app/index.ts';
import { SessionManagementPage } from '../../../../pages/pix-certif/index.ts';
import data from '../../data.json' with { type: 'json' };

const testRef = 'PRO_CLEA_1OK-0KO_EndedByInvigilator_Abandonment';
const snapshotPath = `recette-certif/${testRef}.json`;

test.describe(testRef, () => {
  test.use({
    testRef,
    rightWrongAnswersSequence: [true],
    candidateData: data.certifiableUser,
    certificationKey: CERTIFICATIONS_DATA.CLEA.key,
  });

  test(
    `${testRef} - User takes a certification test for a PRO certification center, CLEA subscription. one challenge only answered. Ended by invigilator for abandonment`,
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
      const { sessionNumber, invigilatorOverviewPage } = preparedCertificationTest;

      await test.step('user stops at second challenge', async () => {
        await expect(pixAppPage.getByLabel('Votre progression')).toContainText('2 / 32');
      });

      await test.step('invigilator ends the certification test', async () => {
        await invigilatorOverviewPage.endCertificationTest(
          data.certifiableUser.firstName,
          data.certifiableUser.lastName,
        );
      });

      await test.step('Finalization by marking a technical issue and scoring', async () => {
        const sessionManagementPage = new SessionManagementPage(pixCertifProPage);
        const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
        await expect(pixCertifProPage.getByText(data.certifiableUser.lastName)).toBeVisible();
        await sessionFinalizationPage.markAbandonmentFor(data.certifiableUser.lastName);
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
            Statut: 'Terminée par le surveillant',
            Score: '55',
            'Signalements impactants non résolus': '',
            'Certification passée': 'Double Certification Pix/CléA Numérique',
          });
          const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
            data.certifiableUser.firstName,
          );
          certificationNumber = certificationInformationPage.getCertificationNumber();
          await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
            sessionNumber,
            status: 'Rejetée',
            score: '55 Pix',
          });
          const cleaResult = await certificationInformationPage.getCleaResult();
          expect(cleaResult).toBe('Rejetée');
          await checkCertificationDetailsAndExpectSuccess(certificationInformationPage, {
            nbAnsweredQuestionsOverTotal: '1/32',
            nbQuestionsOK: 1,
            nbQuestionsKO: 0,
            nbQuestionsAband: 0,
            nbValidatedTechnicalIssues: 0,
            testEndedBy: 'Le surveillant',
            abortReason: 'Abandon : Manque de temps ou départ prématuré',
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
