import { expect, test } from '../../../../../fixtures/certification/index.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../../../helpers/certification/utils.ts';
import { CERTIFICATIONS_DATA } from '../../../../../helpers/db-data.ts';
import { HomePage as AdminHomePage } from '../../../../../pages/pix-admin/index.ts';
import { SessionManagementPage } from '../../../../../pages/pix-certif/index.ts';

const testRef = 'EDU_32OK-0KO';
const snapshotPath = `recette-certif/${testRef}.json`;

test(
  `${testRef} - User takes a certification test for a Pix+ Edu subscription. 32 right answers`,
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
    pixAppCertifiableUserPage,
    pixCertifProPage,
    enrollCandidateAndPassExam,
    pixAdminRoleCertifPage,
    getCertifiableUserData,
    waitForScoringJobToBeCompleted,
    snapshotHandler,
  }) => {
    const certifiableUserData = await getCertifiableUserData(0);
    const pixAppCertifiablePage = await pixAppCertifiableUserPage(certifiableUserData);
    const { sessionNumber, certificationNumber } = await enrollCandidateAndPassExam({
      testRef,
      certificationKey: CERTIFICATIONS_DATA.EDU_1ER_DEGRE,
      rightWrongAnswersSequence: Array(32).fill(true),
      pixAppPage: pixAppCertifiablePage,
      certifiableUserData,
    });

    await test.step(`reaches end of certification test`, async () => {
      await expect(pixAppCertifiablePage.locator('h1')).toContainText('Test terminé !');
      await expect(pixAppCertifiablePage.locator('h2')).toContainText(
        'Vos résultats, en attente de validation par les équipes Pix, seront bientôt disponibles sur votre compte Pix',
      );
      await waitForScoringJobToBeCompleted(certificationNumber);
    });

    await test.step('Finalization and scoring', async () => {
      const sessionManagementPage = new SessionManagementPage(pixCertifProPage);
      const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
      await expect(pixCertifProPage.getByText(certifiableUserData.firstName)).toBeVisible();

      await sessionFinalizationPage.finalizeSession();
    });

    const adminHomepage = new AdminHomePage(pixAdminRoleCertifPage);

    await test.step('Check all session data', async () => {
      const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
      const sessionPage = await sessionsMainPage.goToSessionWithRequiredActionPage(sessionNumber);

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
          Prénom: certifiableUserData.firstName,
          Nom: certifiableUserData.lastName,
          Statut: 'Validée',
          Score: '',
          'Signalements impactants non résolus': '',
          'Certification passée': 'Pix+ Édu 1er degré',
        });
        const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
          certifiableUserData.firstName,
        );
        await checkCertificationDetailsAndExpectSuccess(certificationInformationPage, {
          nbAnsweredQuestionsOverTotal: '32/32',
          nbQuestionsOK: 32,
          nbQuestionsKO: 0,
          nbQuestionsAband: 0,
          nbValidatedTechnicalIssues: 0,
        });
      });
    });

    await snapshotHandler.expectOrRecord(snapshotPath);
  },
);
