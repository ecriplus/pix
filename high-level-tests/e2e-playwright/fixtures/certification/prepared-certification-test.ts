import { z } from 'zod';

import { CERTIFICATIONS_DATA } from '../../helpers/db-data.ts';
import { HomePage } from '../../pages/pix-app/index.ts';
import { InvigilatorLoginPage, InvigilatorOverviewPage, SessionListPage } from '../../pages/pix-certif/index.ts';
import { baseCertifTest } from './base.ts';

const ParamsSchema = z.object({
  testRef: z.string().min(1),
  rightWrongAnswersSequence: z.array(z.boolean()).min(1),
  certificationKey: z.string().min(1),
});

type PreparedCertificationTestParams = z.infer<typeof ParamsSchema>;

type PreparedCertificationTestResult = {
  sessionNumber: string;
  invigilatorOverviewPage: InvigilatorOverviewPage;
};

function validateParams(params: PreparedCertificationTestParams) {
  const validation = ParamsSchema.safeParse(params);

  if (!validation.success) {
    const prettyErrorMsg = z.prettifyError(validation.error);
    throw new Error(`❌ preparedCertificationTest Fixture Options:\n${prettyErrorMsg}`);
  }
}

export const preparedCertificationTestFixtures = baseCertifTest.extend<
  PreparedCertificationTestParams & { preparedCertificationTest: PreparedCertificationTestResult }
>({
  testRef: ['', { option: true }],
  rightWrongAnswersSequence: [[], { option: true }],
  certificationKey: ['CORE', { option: true }],
  preparedCertificationTest: [
    async (
      {
        pixAppCertifiablePage,
        pixCertifProPage,
        pixCertifInvigilatorPage,
        snapshotHandler,
        testRef,
        rightWrongAnswersSequence,
        certifiableUserData,
        certificationKey,
      },
      use,
    ) => {
      validateParams({
        testRef,
        rightWrongAnswersSequence,
        certificationKey,
      });
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
        await pixAppCertifiablePage.goto(process.env.PIX_APP_URL!);

        const certificationAccessCodePage = await preparedCertificationTestFixtures.step(
          'Candidate join the session, awaiting to be authorized to start',
          async () => {
            const homePage = new HomePage(pixAppCertifiablePage);
            const certificationStartPage = await homePage.goToStartCertification();
            if (certificationKey === CERTIFICATIONS_DATA.CLEA.key) {
              await expect(pixAppCertifiablePage.getByText('Prêt pour le CléA numérique')).toBeVisible();
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
            await invigOverview.authorizeCandidateToStart(certifiableUserData.firstName, certifiableUserData.lastName);
            return invigOverview;
          },
        );

        await preparedCertificationTestFixtures.step('Candidate takes the test', async () => {
          const challengePage = await certificationAccessCodePage.fillAccessCodeAndStartCertificationTest(accessCode);
          for (const [i, shouldAnswerCorrectly] of rightWrongAnswersSequence.entries()) {
            const challengeImprint = await challengePage.getChallengeImprint();
            snapshotHandler.push('challenge imprint to have value', challengeImprint);
            await expect(pixAppCertifiablePage.getByLabel('Votre progression')).toContainText(`${i + 1} / 32`);
            await challengePage.setRightOrWrongAnswer(shouldAnswerCorrectly);
            await challengePage.validateAnswer();
          }
        });
        return invigilatorOverviewPage;
      });

      const preparedCertificationTestResult: PreparedCertificationTestResult = {
        sessionNumber,
        invigilatorOverviewPage,
      };
      await use(preparedCertificationTestResult);
    },
    { timeout: 25_000 },
  ],
});

export const expect = preparedCertificationTestFixtures.expect;
