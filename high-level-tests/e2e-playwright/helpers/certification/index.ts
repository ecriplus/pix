import { expect } from '@playwright/test';

import { CertificationInformationPage, CertificationSessionPage } from '../../pages/pix-admin/index.ts';

export async function checkSessionInformationAndExpectSuccess(
  certificationSessionPage: CertificationSessionPage,
  data: {
    certificationCenter: string;
    address: string;
    room: string;
    invigilatorName: string;
    status: string;
    nbStartedCertifications: number;
    nbIssueReportsUnsolved: number;
    nbIssueReports: number;
    nbCertificationsInError: number;
  },
) {
  const sessionInfo = await certificationSessionPage.getInfo();

  expect(data.certificationCenter).toBe(sessionInfo.certificationCenter);
  expect(data.address).toBe(sessionInfo.address);
  expect(data.room).toBe(sessionInfo.room);
  expect(data.invigilatorName).toBe(sessionInfo.invigilatorName);
  expect(data.status).toBe(sessionInfo.status);
  expect(data.nbStartedCertifications).toBe(sessionInfo.nbStartedCertifications);
  expect(data.nbIssueReportsUnsolved).toBe(sessionInfo.nbIssueReportsUnsolved);
  expect(data.nbIssueReports).toBe(sessionInfo.nbIssueReports);
  expect(data.nbCertificationsInError).toBe(sessionInfo.nbCertificationsInError);
}

export async function checkCertificationGeneralInformationAndExpectSuccess(
  certificationInformationPage: CertificationInformationPage,
  data: {
    sessionNumber: string;
    status: string;
    score: string;
  },
) {
  const certificationGeneralInfo = await certificationInformationPage.getGeneralInfo();

  expect(data.sessionNumber).toBe(certificationGeneralInfo.sessionNumber);
  expect(data.status).toBe(certificationGeneralInfo.status);
  expect(data.score).toBe(certificationGeneralInfo.score);
}

export async function checkCertificationDetailsAndExpectSuccess(
  certificationInformationPage: CertificationInformationPage,
  data: {
    nbAnsweredQuestionsOverTotal: string;
    nbQuestionsOK: number;
    nbQuestionsKO: number;
    nbQuestionsAband: number;
    nbValidatedTechnicalIssues: number;
  },
) {
  const certificationDetails = await certificationInformationPage.getDetails();

  expect(data.nbAnsweredQuestionsOverTotal).toBe(certificationDetails.nbAnsweredQuestionsOverTotal);
  expect(data.nbQuestionsOK).toBe(certificationDetails.nbQuestionsOK);
  expect(data.nbQuestionsKO).toBe(certificationDetails.nbQuestionsKO);
  expect(data.nbQuestionsAband).toBe(certificationDetails.nbQuestionsAband);
  expect(data.nbValidatedTechnicalIssues).toBe(certificationDetails.nbValidatedTechnicalIssues);
}
