import { expect, test } from '../../../../fixtures/certification/index.ts';
import { changeCandidateAnswers } from '../../../../helpers/certification/db.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkCertificationGeneralInformationAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../../helpers/certification/utils.ts';
import { HomePage as AdminHomePage } from '../../../../pages/pix-admin/index.ts';
import { HomePage } from '../../../../pages/pix-app/index.ts';
import { SessionManagementPage } from '../../../../pages/pix-certif/index.ts';

const testRef = 'PRO_CORE_32OK-0KO_Unrejected';
const snapshotPath = `recette-certif/${testRef}.json`;
const certificateBasePath = `recette-certif/${testRef}.certificat`;

test(
  `${testRef} - User takes a certification test for a PRO certification center, only CORE subscription. 32 right answers. Certification is first rejected, then unrejected`,
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
    snapshotHandler,
  }) => {
    const certifiableUserData = await getCertifiableUserData(0);
    const pixAppCertifiablePage = await pixAppCertifiableUserPage(certifiableUserData);
    const { sessionNumber } = await enrollCandidateAndPassExam({
      testRef,
      rightWrongAnswersSequence: Array(32).fill(true),
      pixAppPage: pixAppCertifiablePage,
      certifiableUserData,
    });
    let certificationNumber = '';

    await test.step(`reaches end of certification test`, async () => {
      await expect(pixAppCertifiablePage.locator('h1')).toContainText('Test terminé !');
      await expect(pixAppCertifiablePage.locator('h2')).toContainText(
        'Vos résultats, en attente de validation par les équipes Pix, seront bientôt disponibles sur votre compte Pix',
      );
    });
    await pixAppCertifiablePage.waitForTimeout(2000); // BEURK, attendre que le scoring soit bien passé

    await test.step('Finalization and scoring', async () => {
      const sessionManagementPage = new SessionManagementPage(pixCertifProPage);
      const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
      await expect(pixCertifProPage.getByText(certifiableUserData.firstName)).toBeVisible();

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
      const certificationInformationPage = await test.step('Check certification information', async () => {
        const certificationListPage = await sessionPage.goToCertificationListPage();
        const certificationData = await certificationListPage.getCertificationData();
        expect(certificationData.length).toBe(1);
        expect(certificationData[0]).toMatchObject({
          Prénom: certifiableUserData.firstName,
          Nom: certifiableUserData.lastName,
          Statut: 'Validée',
          Score: '895',
          'Signalements impactants non résolus': '',
          'Certification passée': 'Certification Pix',
        });
        const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
          certifiableUserData.firstName,
        );
        certificationNumber = certificationInformationPage.getCertificationNumber();
        await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
          sessionNumber,
          status: 'Validée',
          score: '895 Pix',
        });
        await checkCertificationDetailsAndExpectSuccess(certificationInformationPage, {
          nbAnsweredQuestionsOverTotal: '32/32',
          nbQuestionsOK: 32,
          nbQuestionsKO: 0,
          nbQuestionsAband: 0,
          nbValidatedTechnicalIssues: 0,
        });
        return certificationInformationPage;
      });
      await test.step('Rejected and unreject certification to check for scoring', async () => {
        await test.step('Reject certification', async () => {
          await certificationInformationPage.rejectCertification();
          await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
            sessionNumber,
            status: 'Rejetée',
            score: '895 Pix',
          });
        });

        await test.step('Alter candidate answers directly in BDD to have half right, half wrong, to demonstrate re-scoring', async () => {
          const alternateRightWrongSequence = Array.from(Array(32).fill(true), (_, i) => i % 2 === 0);
          await changeCandidateAnswers(parseInt(certificationNumber), alternateRightWrongSequence);
        });

        await test.step('Unreject certification', async () => {
          await certificationInformationPage.unrejectCertification();
          await checkCertificationGeneralInformationAndExpectSuccess(certificationInformationPage, {
            sessionNumber,
            status: 'Validée',
            score: '806 Pix',
          });
        });
      });
    });

    await test.step('Publish session', async () => {
      const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
      await sessionsMainPage.publishSession(sessionNumber);
    });

    await test.step('User checks their certification result', async () => {
      await pixAppCertifiablePage.goto(process.env.PIX_APP_URL as string);
      const homePage = new HomePage(pixAppCertifiablePage);
      const certificationsListPage = await homePage.goToMyCertifications();
      const status = await certificationsListPage.getCertificationStatus(certificationNumber);
      expect(status).toBe('Obtenue');
      const certificationResultPage = await certificationsListPage.goToCertificationResult(certificationNumber);
      const { pixScoreObtained, pixLevelReached } = await certificationResultPage.getResultInfo();
      expect(pixScoreObtained).toEqual('PIX 806 CERTIFIÉS');
      expect(pixLevelReached).toEqual('Vous avez atteint le niveau Expert 1 de la Certification Pix !');
      const certificatePdfBuffer = await certificationResultPage.downloadCertificate();

      await snapshotHandler.comparePdfOrRecord(certificatePdfBuffer, certificateBasePath);
    });
    await snapshotHandler.expectOrRecord(snapshotPath);
  },
);
