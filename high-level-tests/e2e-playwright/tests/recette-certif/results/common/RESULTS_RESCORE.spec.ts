import { expect, test } from '../../../../fixtures/certification/index.ts';
import { changeCandidateAnswers } from '../../../../helpers/certification/db.ts';
import { checkSessionInformationAndExpectSuccess, getTestRef } from '../../../../helpers/certification/utils.ts';
import { HomePage as AdminHomePage } from '../../../../pages/pix-admin/index.ts';
import { SessionManagementPage } from '../../../../pages/pix-certif/index.ts';

test(
  `${getTestRef(import.meta.url)}`,
  {
    tag: ['@core', '@results'],
    annotation: [
      {
        type: 'scenario',
        description: `User takes a certification test. 32 right answers.
         - Test reaches end screen
         - Session finalized
         - Results visible in all PixAdmin screens
         - Rescoring certification by altering answers
         - Check changes on PixAdmin`,
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
    testRef,
  }) => {
    const certifiableUserData = await getCertifiableUserData('buffy.summers@example.net');
    const pixAppCertifiablePage = await pixAppCertifiableUserPage(certifiableUserData);
    const { sessionNumber, certificationNumber, invigilatorOverviewPage } = await enrollCandidateAndPassExam({
      testRef,
      rightWrongAnswersSequence: Array(32).fill(true),
      pixAppPage: pixAppCertifiablePage,
      certifiableUserData,
    });
    await invigilatorOverviewPage.close();

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
      await sessionFinalizationPage.close();
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
          Résultats: 'Expert 1 (895 Pix)',
          'Signalements impactants non résolus': '',
          'Certification passée': 'Pix Cœur',
        });

        const certificationInformationPage = await certificationListPage.goToCertificationInfoPage(
          certifiableUserData.firstName,
        );
        const certificationGeneralInfo = await certificationInformationPage.getGeneralInfo();
        expect(certificationGeneralInfo.sessionNumber).toBe(sessionNumber);
        expect(certificationGeneralInfo.status).toBe('Validée');
        expect(certificationGeneralInfo.result).toBe('Expert 1 (895 Pix)');

        const certificationDetails = await certificationInformationPage.getDetails();
        expect(certificationDetails.status).toBe('Validée');
        expect(certificationDetails.result).toBe('Expert 1 (895 Pix)');
        expect(certificationDetails.nbAnsweredQuestionsOverTotal).toBe('32/32');
        expect(certificationDetails.nbQuestionsOK).toBe(32);
        expect(certificationDetails.nbQuestionsKO).toBe(0);
        expect(certificationDetails.nbQuestionsAband).toBe(0);
        expect(certificationDetails.nbValidatedTechnicalIssues).toBe(0);
        return certificationInformationPage;
      });
      await test.step('Rescore certification and check for scoring', async () => {
        await test.step('Rescore certification to demonstrate idempotency', async () => {
          await certificationInformationPage.rescoreCertification();
          const certificationGeneralInfo = await certificationInformationPage.getGeneralInfo();
          expect(certificationGeneralInfo.sessionNumber).toBe(sessionNumber);
          expect(certificationGeneralInfo.status).toBe('Validée');
          expect(certificationGeneralInfo.result).toBe('Expert 1 (895 Pix)');
        });

        await test.step('Alter candidate answers directly in BDD to have half right, half wrong, to demonstrate re-scoring', async () => {
          await changeCandidateAnswers(parseInt(certificationNumber), [true, false]);
        });

        await test.step('Rescore certification twice in a row to demonstrate idempotency', async () => {
          await certificationInformationPage.rescoreCertification();
          await waitForScoringJobToBeCompleted(certificationNumber);
          await certificationInformationPage.page.reload();
          let certificationGeneralInfo = await certificationInformationPage.getGeneralInfo();
          expect(certificationGeneralInfo.sessionNumber).toBe(sessionNumber);
          expect(certificationGeneralInfo.status).toBe('Validée');
          expect(certificationGeneralInfo.result).toBe('Expert 1 (804 Pix)');

          await certificationInformationPage.rescoreCertification();
          await waitForScoringJobToBeCompleted(certificationNumber);
          await certificationInformationPage.page.reload();
          certificationGeneralInfo = await certificationInformationPage.getGeneralInfo();
          expect(certificationGeneralInfo.sessionNumber).toBe(sessionNumber);
          expect(certificationGeneralInfo.status).toBe('Validée');
          expect(certificationGeneralInfo.result).toBe('Expert 1 (804 Pix)');
        });
      });
    });
  },
);
