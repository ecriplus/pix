import { expect, test } from '../../../fixtures/certification/index.ts';
import { checkSessionInformationAndExpectSuccess } from '../../../helpers/certification/utils.ts';
import { CERTIFICATIONS_DATA } from '../../../helpers/db-data.ts';
import { HomePage as AdminHomePage } from '../../../pages/pix-admin/index.ts';
import { SessionListPage, SessionManagementPage } from '../../../pages/pix-certif/index.ts';

const testRef = 'INDIVIDUAL_ENROLMENT';

test(`${testRef} - Enroll candidates through individual enrolment modal`, async ({
  pixCertifProPage,
  pixAdminRoleCertifPage,
  getCertifiableUserData,
  pixAppCertifiableUserPage,
  passManyCertificationExams,
}) => {
  test.slow();
  const userDataCoreSubscription = await getCertifiableUserData(0);
  const userDataCleaSubscription = await getCertifiableUserData(1);
  await pixCertifProPage.goto(process.env.PIX_CERTIF_URL!);

  let sessionNumber = '',
    accessCode = '',
    invigilatorCode = '';
  const sessionManagementPage = await test.step('Create session', async () => {
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

  await test.step('Enroll first candidate to CORE exam', async () => {
    await sessionManagementPage.goToEnrollCandidateForm();
    await sessionManagementPage.addCandidate({
      ...userDataCoreSubscription,
      enrollFor: 'CORE',
    });
    const enrolledCandidatesSoFar = await sessionManagementPage.getEnrolledCandidatesData();
    expect(enrolledCandidatesSoFar).toMatchObject([
      {
        'Nom de naissance': userDataCoreSubscription.lastName,
        Prénom: userDataCoreSubscription.firstName,
        'Date de naissance':
          userDataCoreSubscription.birthDay +
          '/' +
          userDataCoreSubscription.birthMonth +
          '/' +
          userDataCoreSubscription.birthYear,
        'Certification sélectionnée': 'Certification Pix',
      },
    ]);
  });

  await test.step('Get an error when trying to enroll another candidate with same identity', async () => {
    await sessionManagementPage.goToEnrollCandidateForm();
    await sessionManagementPage.addCandidate({
      ...userDataCoreSubscription,
      enrollFor: 'CORE',
      checkForSuccess: false,
    });
    await expect(
      pixCertifProPage.getByText("Ce candidat est déjà dans la liste, vous ne pouvez pas l'ajouter à nouveau."),
    ).toBeVisible();
    await pixCertifProPage.getByRole('button', { name: 'Fermer la notification' }).click();
    await pixCertifProPage.getByRole('button', { name: "Fermer la modale d'ajout de candidat" }).click();
    const enrolledCandidatesSoFar = await sessionManagementPage.getEnrolledCandidatesData();
    expect(enrolledCandidatesSoFar).toMatchObject([
      {
        'Nom de naissance': userDataCoreSubscription.lastName,
        Prénom: userDataCoreSubscription.firstName,
        'Date de naissance':
          userDataCoreSubscription.birthDay +
          '/' +
          userDataCoreSubscription.birthMonth +
          '/' +
          userDataCoreSubscription.birthYear,
        'Certification sélectionnée': 'Certification Pix',
      },
    ]);
  });

  await test.step('Enroll second candidate to CLEA exam', async () => {
    await sessionManagementPage.goToEnrollCandidateForm();
    await sessionManagementPage.addCandidate({
      ...userDataCleaSubscription,
      enrollFor: CERTIFICATIONS_DATA.CLEA.key,
    });
    const enrolledCandidatesSoFar = await sessionManagementPage.getEnrolledCandidatesData();
    expect(enrolledCandidatesSoFar).toMatchObject([
      {
        'Nom de naissance': userDataCleaSubscription.lastName,
        Prénom: userDataCleaSubscription.firstName,
        'Date de naissance':
          userDataCleaSubscription.birthDay +
          '/' +
          userDataCleaSubscription.birthMonth +
          '/' +
          userDataCleaSubscription.birthYear,
        'Certification sélectionnée': 'Double Certification Pix-CléA Numérique',
      },
      {
        'Nom de naissance': userDataCoreSubscription.lastName,
        Prénom: userDataCoreSubscription.firstName,
        'Date de naissance':
          userDataCoreSubscription.birthDay +
          '/' +
          userDataCoreSubscription.birthMonth +
          '/' +
          userDataCoreSubscription.birthYear,
        'Certification sélectionnée': 'Certification Pix',
      },
    ]);
  });

  const pixAppCorePage = await pixAppCertifiableUserPage(userDataCoreSubscription);
  const pixAppCleaPage = await pixAppCertifiableUserPage(userDataCleaSubscription);
  await test.step('Both candidates pass the exam', async () => {
    await passManyCertificationExams({
      examsData: [
        {
          certifiableUserData: userDataCoreSubscription,
          rightWrongAnswersSequence: [true],
          pixAppPage: pixAppCorePage,
        },
        {
          certifiableUserData: userDataCleaSubscription,
          rightWrongAnswersSequence: [true],
          pixAppPage: pixAppCleaPage,
        },
      ],
      sessionNumber,
      accessCode,
      invigilatorCode,
    });
  });

  await test.step('Finalization by marking technical issues on both candidates', async () => {
    const sessionManagementPage = new SessionManagementPage(pixCertifProPage);
    const sessionFinalizationPage = await sessionManagementPage.goToFinalizeSession();
    await expect(pixCertifProPage.getByText(userDataCoreSubscription.firstName)).toBeVisible();
    await sessionFinalizationPage.markTechnicalIssueFor(userDataCoreSubscription.lastName);
    await expect(pixCertifProPage.getByText(userDataCleaSubscription.firstName)).toBeVisible();
    await sessionFinalizationPage.markTechnicalIssueFor(userDataCleaSubscription.lastName);

    await sessionFinalizationPage.finalizeSession();
  });

  const adminHomepage = new AdminHomePage(pixAdminRoleCertifPage);
  await test.step('Check candidates did pass what they enrolled for', async () => {
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
      expect(certificationData.length).toBe(2);
      expect(certificationData[0]).toMatchObject({
        Prénom: userDataCoreSubscription.firstName,
        Nom: userDataCoreSubscription.lastName,
        Statut: 'Annulée',
        Score: '55',
        'Signalements impactants non résolus': '',
        'Certification passée': 'Certification Pix',
      });
      expect(certificationData[1]).toMatchObject({
        Prénom: userDataCleaSubscription.firstName,
        Nom: userDataCleaSubscription.lastName,
        Statut: 'Annulée',
        Score: '55',
        'Signalements impactants non résolus': '',
        'Certification passée': 'Double Certification Pix/CléA Numérique',
      });
    });
  });
});
