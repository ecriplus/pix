import * as tooling from '../common/tooling/index.js';
import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';
import { ProSeed } from './cases/simple-pro-certification.js';
import { ScoManagingStudent } from './cases/simple-sco-managing-students-certification.js';
import { CERTIFIABLE_SUCCESS_USER_ID } from './constants.js';
import { setupConfigurations } from './setup-configuration.js';

async function teamCertificationDataBuilder({ databaseBuilder }) {
  //await _createSuccessCertifiableUser({ databaseBuilder });
  await setupConfigurations({ databaseBuilder });

  // Cases
  await new ProSeed({ databaseBuilder }).create();
  await new ScoManagingStudent({ databaseBuilder }).create();
}

export { teamCertificationDataBuilder };

async function _createSuccessCertifiableUser({ databaseBuilder }) {
  const userId = databaseBuilder.factory.buildUser.withRawPassword({
    id: CERTIFIABLE_SUCCESS_USER_ID,
    firstName: 'Certifiable',
    lastName: 'Certif',
    email: 'certif-success@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
    shouldChangePassword: false,
  }).id;

  acceptPixOrgaTermsOfService(databaseBuilder, CERTIFIABLE_SUCCESS_USER_ID);

  await tooling.profile.createPerfectProfile({
    databaseBuilder,
    userId,
  });
}
