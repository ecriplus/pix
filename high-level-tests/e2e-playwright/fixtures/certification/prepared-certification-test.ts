import { BrowserContext, expect, Page, test as base } from '@playwright/test';
import { z } from 'zod';

import { LoginPage } from '../../pages/pix-app/index.ts';
import { InvigilatorLoginPage, SessionListPage } from '../../pages/pix-certif/index.ts';
import { SnapshotHandler } from '../snapshot.ts';

const CandidateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  rawPassword: z.string().min(1),
  sex: z.string(),
  birthdate: z.string(),
  birthDay: z.string(),
  birthMonth: z.string(),
  birthYear: z.string().length(4),
  birthCountry: z.string(),
  birthCity: z.string(),
  postalCode: z.string(),
});
const ParamsSchema = z.object({
  testRef: z.string().min(1),
  rightWrongAnswersSequence: z.array(z.boolean()).min(1),
  candidateData: CandidateSchema,
});

type DataParams = z.infer<typeof ParamsSchema>;

type PreparedCertificationTestParams = DataParams & {
  pixAppPage: Page;
  authentifiedPixCertifContext: BrowserContext;
  snapshotHandler: SnapshotHandler;
};

type PreparedCertificationTestResult = {
  sessionNumber: string;
  invigilatorPage: Page;
  pixCertifPage: Page;
  snapshotHandler: SnapshotHandler;
};

function validateParams(params: DataParams) {
  const validation = ParamsSchema.safeParse(params);

  if (!validation.success) {
    const prettyErrorMsg = z.prettifyError(validation.error);
    throw new Error(`❌ preparedCertificationTest Fixture Options:\n${prettyErrorMsg}`);
  }
}

export const test = base.extend<
  PreparedCertificationTestParams & { preparedCertificationTest: PreparedCertificationTestResult }
>({
  testRef: ['', { option: true }],
  rightWrongAnswersSequence: [[], { option: true }],
  candidateData: [{} as never, { option: true }],
  authentifiedPixCertifContext: [{} as never, { option: true }],
  pixAppPage: [{} as never, { option: true }],
  preparedCertificationTest: async (
    {
      pixAppPage,
      authentifiedPixCertifContext,
      snapshotHandler,
      testRef,
      rightWrongAnswersSequence,
      candidateData,
    }: PreparedCertificationTestParams,
    use,
  ) => {
    validateParams({
      testRef,
      rightWrongAnswersSequence,
      candidateData,
    });

    const pixCertifPage = await authentifiedPixCertifContext.newPage();
    let sessionNumber = '',
      accessCode = '',
      invigilatorCode = '';

    await test.step('Enrollment', async () => {
      await pixCertifPage.goto(process.env.PIX_CERTIF_URL!);

      const sessionManagementPage = await test.step('Create session', async () => {
        const sessionListPage = new SessionListPage(pixCertifPage);
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

      await test.step('enroll for core certification', async () => {
        await sessionManagementPage.goToEnrollCandidateForm();
        await sessionManagementPage.addCandidate(candidateData);
      });
    });

    const invigilatorPage = await test.step('Evaluation', async () => {
      await pixAppPage.goto(process.env.PIX_APP_URL!);

      const certificationAccessCodePage =
        await test.step('Candidate join the session, awaiting to be authorized to start', async () => {
          const loginPage = new LoginPage(pixAppPage);
          const homePage = await loginPage.login(candidateData.email, candidateData.rawPassword);
          const certificationStartPage = await homePage.goToStartCertification();
          return certificationStartPage.fillSessionInfoAndNavigateIntro({
            sessionNumber,
            ...candidateData,
          });
        });

      const invigilatorPage = await test.step('Invigilator authorized candidate to start', async () => {
        const invigilatorPage = await authentifiedPixCertifContext.newPage();
        const invigLogin = await InvigilatorLoginPage.goto(invigilatorPage);
        const invigOverview = await invigLogin.login(sessionNumber, invigilatorCode);
        await invigOverview.authorizeCandidateToStart(candidateData.firstName, candidateData.lastName);
        return invigilatorPage;
      });

      await test.step('Candidate takes the test', async () => {
        const challengePage = await certificationAccessCodePage.fillAccessCodeAndStartCertificationTest(accessCode);
        for (const [i, shouldAnswerCorrectly] of rightWrongAnswersSequence.entries()) {
          const challengeImprint = await challengePage.getChallengeImprint();
          snapshotHandler.push('challenge imprint to have value', challengeImprint);
          await expect(pixAppPage.getByLabel('Votre progression')).toContainText(`${i + 1} / 32`);
          await challengePage.setRightOrWrongAnswer(shouldAnswerCorrectly);
          await challengePage.validateAnswer();
        }
      });
      return invigilatorPage;
    });

    const preparedCertificationTestResult: PreparedCertificationTestResult = {
      sessionNumber,
      invigilatorPage,
      pixCertifPage,
      snapshotHandler,
    };
    await use(preparedCertificationTestResult);
  },
});
