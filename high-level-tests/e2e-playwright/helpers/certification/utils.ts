import { expect } from '@playwright/test';
import path from 'path';

import { CertificationSessionPage } from '../../pages/pix-admin/index.ts';

export async function checkSessionInformationAndExpectSuccess(
  certificationSessionPage: CertificationSessionPage,
  data: {
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

  expect(data.address).toBe(sessionInfo.address);
  expect(data.room).toBe(sessionInfo.room);
  expect(data.invigilatorName).toBe(sessionInfo.invigilatorName);
  expect(data.status).toBe(sessionInfo.status);
  expect(data.nbStartedCertifications).toBe(sessionInfo.nbStartedCertifications);
  expect(data.nbIssueReportsUnsolved).toBe(sessionInfo.nbIssueReportsUnsolved);
  expect(data.nbIssueReports).toBe(sessionInfo.nbIssueReports);
  expect(data.nbCertificationsInError).toBe(sessionInfo.nbCertificationsInError);
}

export function getTestRef(filePath: string) {
  return path.basename(filePath).split('.')[0];
}
