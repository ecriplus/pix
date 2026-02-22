import { Page } from '@playwright/test';

import { PixCertifiableUserData } from '../../helpers/certification/builders/types.ts';
import { CERTIFICATIONS_DATA } from '../../helpers/db-data.ts';
import { HomePage } from '../../pages/pix-app/index.ts';
import { InvigilatorLoginPage, InvigilatorOverviewPage, SessionListPage } from '../../pages/pix-certif/index.ts';
import { baseCertifTest } from './base.ts';

type PreparedCertificationTestResult = {
  sessionNumber: string;
  invigilatorOverviewPage: InvigilatorOverviewPage;
};

type PreparedCertificationTestParams = {
  testRef: string;
  rightWrongAnswersSequence: boolean[];
  certificationKey?: string;
  certifiableUserData: PixCertifiableUserData;
  pixAppPage: Page;
};

export const preparedCertificationTestFixtures = baseCertifTest.extend<{
  preparedCertificationTest: (args: PreparedCertificationTestParams) => Promise<PreparedCertificationTestResult>;
}>({
  preparedCertificationTest: [
    async ({ pixCertifProPage, pixCertifInvigilatorPage, snapshotHandler }, use) => {
      const prepareCertificationTest = async ({
        testRef,
        rightWrongAnswersSequence,
        certificationKey = 'CORE',
        certifiableUserData,
        pixAppPage,
      }: PreparedCertificationTestParams) => {
        let sessionNumber = '',
          accessCode = '',
          invigilatorCode = '';

        await preparedCertificationTestFixtures.step('Enrollment', async () => {
          await pixCertifProPage.goto(process.env.PIX_CERTIF_URL!);

          const sessionManagementPage = await preparedCertificationTestFixtures.step('Create session', async () => {
            const sessionListPage = new SessionListPage(pixCertifProPage);
            const sessionCreationPage = await sessionListPage.goToCreateSession();
            const sessionManagementPage = await sessionCreationPage.createSession({
              address: `address ${testRef}`,
              room: `room ${testRef}`,
              examiner: `examiner ${testRef}`,
              hour: '09',
              minute: '05',
            });

            const sessionData = await sessionManagementPage.getSessionData();
            sessionNumber = sessionData.sessionNumber;
            accessCode = sessionData.accessCode;
            invigilatorCode = sessionData.invigilatorCode;
            return sessionManagementPage;
          });

          await preparedCertificationTestFixtures.step('enroll for specific certification', async () => {
            await sessionManagementPage.goToEnrollCandidateForm();
            await sessionManagementPage.addCandidate({
              ...certifiableUserData,
              enrollFor: certificationKey,
            });
          });
        });

        const invigilatorOverviewPage = await preparedCertificationTestFixtures.step('Evaluation', async () => {
          await pixAppPage.goto(process.env.PIX_APP_URL!);

          const certificationAccessCodePage = await preparedCertificationTestFixtures.step(
            'Candidate join the session, awaiting to be authorized to start',
            async () => {
              const homePage = new HomePage(pixAppPage);
              const certificationStartPage = await homePage.goToStartCertification();
              if (certificationKey === CERTIFICATIONS_DATA.CLEA.key) {
                await expect(pixAppPage.getByText('Prêt pour le CléA numérique')).toBeVisible();
              }
              return certificationStartPage.fillSessionInfoAndNavigateIntro({
                sessionNumber,
                ...certifiableUserData,
              });
            },
          );

          const invigilatorOverviewPage = await preparedCertificationTestFixtures.step(
            'Invigilator authorized candidate to start',
            async () => {
              const invigLogin = new InvigilatorLoginPage(pixCertifInvigilatorPage);
              const invigOverview = await invigLogin.login(sessionNumber, invigilatorCode);
              await invigOverview.authorizeCandidateToStart(
                certifiableUserData.firstName,
                certifiableUserData.lastName,
              );
              return invigOverview;
            },
          );

          await preparedCertificationTestFixtures.step('Candidate takes the test', async () => {
            const challengePage = await certificationAccessCodePage.fillAccessCodeAndStartCertificationTest(accessCode);
            for (const [i, shouldAnswerCorrectly] of rightWrongAnswersSequence.entries()) {
              const challengeImprint = await challengePage.getChallengeImprint();
              snapshotHandler.push('challenge imprint to have value', challengeImprint);
              await expect(pixAppPage.getByLabel('Votre progression')).toContainText(`${i + 1} / 32`);
              await challengePage.setRightOrWrongAnswer(shouldAnswerCorrectly);
              await challengePage.validateAnswer();
            }
          });
          return invigilatorOverviewPage;
        });

        return {
          sessionNumber,
          invigilatorOverviewPage,
        };
      };
      await use(prepareCertificationTest);
    },
    { timeout: 25_000 },
  ],
});

export const expect = preparedCertificationTestFixtures.expect;
