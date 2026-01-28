import { expect, test } from '../../../../fixtures/index.ts';
import {
  checkCertificationDetailsAndExpectSuccess,
  checkCertificationGeneralInformationAndExpectSuccess,
  checkSessionInformationAndExpectSuccess,
} from '../../../../helpers/certification/index.ts';
import { PIX_ADMIN_CERTIF_DATA, PIX_CERTIF_PRO_DATA } from '../../../../helpers/db-data.ts';
import { LoginPage as AdminLoginPage } from '../../../../pages/pix-admin/index.ts';
import { HomePage, LoginPage } from '../../../../pages/pix-app/index.ts';
import { InvigilatorLoginPage, SessionListPage, SessionManagementPage } from '../../../../pages/pix-certif/index.ts';
import data from '../../data.json' with { type: 'json' };

const testRef = 'PRO_CORE_32OK-0KO';
const snapshotPath = `recette-certif/${testRef}.json`;
const certificateBasePath = `recette-certif/${testRef}.certificat`;

test(
  `user takes a certification test for a PRO certification center, only CORE subscription. 100% success. REF : ${testRef}`,
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
  async ({ page: pixAppPage, pixCertifProContext, pixSuperAdminContext, snapshotHandler }) => {
    test.slow();

    const pixCertifPage = await pixCertifProContext.newPage();

    let sessionNumber = '',
      accessCode = '',
      invigilatorCode = '',
      certificationNumber = '';

    await test.step('Enrollment', async () => {
      const sessionManagementPage = await test.step('creates a certification session', async () => {
        await pixCertifPage.goto(process.env.PIX_CERTIF_URL as string);
        const sessionListPage = new SessionListPage(pixCertifPage);
        const sessionCreationPage = await sessionListPage.goToCreateSession();

        return sessionCreationPage.createSession({
          address: `address ${testRef}`,
          room: `room ${testRef}`,
          examiner: `examiner ${testRef}`,
          hour: '09',
          minute: '05',
        });
      });

      const sessionData = await sessionManagementPage.getSessionData();
      sessionNumber = sessionData.sessionNumber;
      accessCode = sessionData.accessCode;
      invigilatorCode = sessionData.invigilatorCode;

      await test.step('adds a candidate for core certification', async () => {
        await sessionManagementPage.goToEnrollCandidateForm();
        await sessionManagementPage.addCandidate(data.certifiableUser);
      });
    });

    await test.step('Evaluation', async () => {
      await pixAppPage.goto(process.env.PIX_APP_URL as string);
      const loginPage = new LoginPage(pixAppPage);
      const homePage = await loginPage.login(data.certifiableUser.email, data.certifiableUser.rawPassword);

      const certificationAccessCodePage = await test.step('user enter session up until access code page', async () => {
        const certificationStartPage = await homePage.goToStartCertification();
        return certificationStartPage.fillSessionInfoAndNavigateIntro({
          sessionNumber,
          ...data.certifiableUser,
        });
      });

      await test.step('invigilator authorizes user to access the certification session', async () => {
        const invigilatorPage = await pixCertifProContext.newPage();
        const invigilatorLoginPage = await InvigilatorLoginPage.goto(invigilatorPage);
        const invigilatorOverviewPage = await invigilatorLoginPage.login(sessionNumber, invigilatorCode);
        await invigilatorOverviewPage.authorizeCandidateToStart(
          data.certifiableUser.firstName,
          data.certifiableUser.lastName,
        );
      });

      await test.step('user run the test and answers everything correctly', async () => {
        const challengePage = await certificationAccessCodePage.fillAccessCodeAndStartCertificationTest(accessCode);

        await test.step(`answering always right`, async () => {
          let challengeIndex = 0;

          while (!pixAppPage.url().endsWith('/results')) {
            const challengeImprint = await challengePage.getChallengeImprint();
            snapshotHandler.push('challenge imprint to have value', challengeImprint);
            await expect(pixAppPage.getByLabel('Votre progression')).toContainText(`${challengeIndex + 1} / 32`);
            ++challengeIndex;
            await challengePage.setRightOrWrongAnswer(true);
            await challengePage.validateAnswer();
          }
        });

        await test.step(`reaches end of certification test`, async () => {
          await expect(pixAppPage.locator('h1')).toContainText('Test terminé !');
          await expect(pixAppPage.locator('h2')).toContainText(
            'Vos résultats, en attente de validation par les équipes Pix, seront bientôt disponibles sur votre compte Pix',
          );
        });
      });
    });
    await pixAppPage.waitForTimeout(2000); // BEURK, attendre que le scoring soit bien passé

    await test.step('Finalization and scoring', async () => {
      const sessionManagementPage = new SessionManagementPage(pixCertifPage);
      const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
      await expect(pixCertifPage.getByText(data.certifiableUser.firstName)).toBeVisible();

      await sessionFinalizationPage.finalizeSession();
    });

    const pixAdminPage = await pixSuperAdminContext.newPage();
    await pixAdminPage.goto(process.env.PIX_ADMIN_URL as string);
    const adminLoginPage = new AdminLoginPage(pixAdminPage);
    const adminHomepage = await adminLoginPage.login(PIX_ADMIN_CERTIF_DATA.email, PIX_ADMIN_CERTIF_DATA.rawPassword);

    await test.step('Check all session data', async () => {
      const sessionsMainPage = await adminHomepage.goToCertificationSessionsTab();
      const sessionPage = await sessionsMainPage.goToSessionToPublishInfo(sessionNumber);

      await test.step('Check session information', async () => {
        await checkSessionInformationAndExpectSuccess(sessionPage, {
          certificationCenter:
            PIX_CERTIF_PRO_DATA.certificationCenter.externalId + PIX_CERTIF_PRO_DATA.certificationCenter.type,
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
        const certificationInformationPage = await sessionPage.goToCertificationInfoPage(
          data.certifiableUser.firstName,
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
      expect(status).toBe('Obtenue');
      const certificationResultPage = await certificationsListPage.goToCertificationResult(certificationNumber);
      const { pixScoreObtained, pixLevelReached } = await certificationResultPage.getResultInfo();
      expect(pixScoreObtained).toEqual('PIX 895 CERTIFIÉS');
      expect(pixLevelReached).toEqual('Vous avez atteint le niveau Expert 1 de la Certification Pix !');
      const certificatePdfBuffer = await certificationResultPage.downloadCertificate();

      await snapshotHandler.comparePdfOrRecord(certificatePdfBuffer, certificateBasePath);
    });
    await snapshotHandler.expectOrRecord(snapshotPath);
  },
);
