import { Page } from '@playwright/test';

import { PixCertifiableUserData } from '../../helpers/certification/builders/types.ts';
import { CERTIFICATIONS_DATA } from '../../helpers/db-data.ts';
import { HomePage } from '../../pages/pix-app/index.ts';
import { InvigilatorLoginPage, InvigilatorOverviewPage, SessionListPage } from '../../pages/pix-certif/index.ts';
import { baseCertifTest } from './base.ts';

type EnrollCandidateParams = {
  testRef: string;
  certificationKey?: string;
  certifiableUserData: PixCertifiableUserData;
};

type EnrollCandidateResult = {
  sessionNumber: string;
  accessCode: string;
  invigilatorCode: string;
};

type PassCertificationExamParams = {
  certifiableUserData: PixCertifiableUserData;
  sessionNumber: string;
  accessCode: string;
  invigilatorCode: string;
  rightWrongAnswersSequence: boolean[];
  certificationKey?: string;
  pixAppPage: Page;
};

type PassCertificationExamResult = {
  invigilatorOverviewPage: InvigilatorOverviewPage;
};

type EnrollCandidateAndPassExamParams = {
  testRef: string;
  certificationKey?: string;
  certifiableUserData: PixCertifiableUserData;
  rightWrongAnswersSequence: boolean[];
  pixAppPage: Page;
};

type EnrollCandidateAndPassExamResult = {
  sessionNumber: string;
  invigilatorOverviewPage: InvigilatorOverviewPage;
};

// todo renomme moi
export const certifSetupFixtures = baseCertifTest.extend<{
  enrollCandidate: (args: EnrollCandidateParams) => Promise<EnrollCandidateResult>;
  passCertificationExam: (args: PassCertificationExamParams) => Promise<PassCertificationExamResult>;
  enrollCandidateAndPassExam: (args: EnrollCandidateAndPassExamParams) => Promise<EnrollCandidateAndPassExamResult>;
}>({
  enrollCandidate: async ({ pixCertifProPage }, use) => {
    const enrollCandidate = async ({
      testRef,
      certificationKey = 'CORE',
      certifiableUserData,
    }: EnrollCandidateParams) => {
      let sessionNumber = '',
        accessCode = '',
        invigilatorCode = '';

      await certifSetupFixtures.step('Enrollment', async () => {
        await pixCertifProPage.goto(process.env.PIX_CERTIF_URL!);

        const sessionManagementPage = await certifSetupFixtures.step('Create session', async () => {
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

        await certifSetupFixtures.step('enroll for specific certification', async () => {
          await sessionManagementPage.goToEnrollCandidateForm();
          await sessionManagementPage.addCandidate({
            ...certifiableUserData,
            enrollFor: certificationKey,
          });
        });
      });

      return {
        sessionNumber,
        accessCode,
        invigilatorCode,
      };
    };
    await use(enrollCandidate);
  },
  passCertificationExam: async ({ pixCertifInvigilatorPage, snapshotHandler }, use) => {
    const passCertificationExam = async ({
      certifiableUserData,
      sessionNumber,
      accessCode,
      invigilatorCode,
      certificationKey,
      rightWrongAnswersSequence,
      pixAppPage,
    }: PassCertificationExamParams) => {
      const invigilatorOverviewPage = await certifSetupFixtures.step('Evaluation', async () => {
        await pixAppPage.goto(process.env.PIX_APP_URL!);

        const certificationAccessCodePage = await certifSetupFixtures.step(
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

        const invigilatorOverviewPage = await certifSetupFixtures.step(
          'Invigilator authorized candidate to start',
          async () => {
            const invigLogin = new InvigilatorLoginPage(pixCertifInvigilatorPage);
            const invigOverview = await invigLogin.login(sessionNumber, invigilatorCode);
            await invigOverview.authorizeCandidateToStart(certifiableUserData.firstName, certifiableUserData.lastName);
            return invigOverview;
          },
        );

        await certifSetupFixtures.step('Candidate takes the test', async () => {
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
        invigilatorOverviewPage,
      };
    };
    await use(passCertificationExam);
  },
  enrollCandidateAndPassExam: async ({ enrollCandidate, passCertificationExam }, use) => {
    const enrollCandidateAndPassExam = async ({
      testRef,
      certificationKey,
      certifiableUserData,
      rightWrongAnswersSequence,
      pixAppPage,
    }: EnrollCandidateAndPassExamParams) => {
      const { sessionNumber, accessCode, invigilatorCode } = await enrollCandidate({
        testRef,
        certificationKey,
        certifiableUserData,
      });
      const { invigilatorOverviewPage } = await passCertificationExam({
        certifiableUserData,
        sessionNumber,
        accessCode,
        invigilatorCode,
        rightWrongAnswersSequence,
        certificationKey,
        pixAppPage,
      });

      return { sessionNumber, invigilatorOverviewPage };
    };
    await use(enrollCandidateAndPassExam);
  },
});

export const expect = certifSetupFixtures.expect;
