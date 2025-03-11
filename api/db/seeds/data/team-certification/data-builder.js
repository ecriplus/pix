import { CertificationCenter } from '../../../../src/shared/domain/models/index.js';
import { FEATURE_CAN_REGISTER_FOR_A_COMPLEMENTARY_CERTIFICATION_ALONE_ID } from '../common/constants.js';
import * as tooling from '../common/tooling/index.js';
import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';
import {
  CERTIFIABLE_SUCCESS_USER_ID,
  complementaryCertificationIds,
  PRO_PILOT_CERTIFICATION_CENTER_ID,
  V3_CERTIFICATION_CENTER_ID,
  V3_CERTIFICATION_CENTER_USER_ID,
  V3_PRO_PILOT_EXTERNAL_ID,
} from './constants.js';
import { proOrganizationWithCertifCenter } from './create-pro-organization-with-certif-center.js';
import { scoOrganizationManaginAgriStudentsWithFregata } from './create-sco-organization-managing-agri-student-with-fregata.js';
import { scoOrganizationManaginStudentsWithSiecle } from './create-sco-organization-managing-student-with-siecle.js';
import { scoOrganizationNotManagingStudents } from './create-sco-organization-not-managing-students.js';
import { setupConfigurations } from './setup-configuration.js';

async function teamCertificationDataBuilder({ databaseBuilder }) {
  await scoOrganizationManaginAgriStudentsWithFregata({ databaseBuilder });
  await scoOrganizationManaginStudentsWithSiecle({ databaseBuilder });
  await proOrganizationWithCertifCenter({ databaseBuilder });
  await scoOrganizationNotManagingStudents({ databaseBuilder });
  await _createV3PilotCertificationCenter({ databaseBuilder });
  await _createSuccessCertifiableUser({ databaseBuilder });
  await setupConfigurations({ databaseBuilder });
}

export { teamCertificationDataBuilder };

async function _createV3PilotCertificationCenter({ databaseBuilder }) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: V3_CERTIFICATION_CENTER_USER_ID,
    firstName: 'membre certif v3',
    lastName: 'Certification',
    email: 'certifv3@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, V3_CERTIFICATION_CENTER_USER_ID);

  await tooling.certificationCenter.createCertificationCenter({
    databaseBuilder,
    certificationCenterId: V3_CERTIFICATION_CENTER_ID,
    name: 'Centre de certification v3',
    type: CertificationCenter.types.PRO,
    externalId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [{ id: V3_CERTIFICATION_CENTER_USER_ID }],
    isV3Pilot: true,
    complementaryCertificationIds: [],
  });

  await tooling.certificationCenter.createCertificationCenter({
    databaseBuilder,
    certificationCenterId: PRO_PILOT_CERTIFICATION_CENTER_ID,
    name: 'Centre de certification v3 pro pilote pour la séparation pix/pix+',
    type: CertificationCenter.types.PRO,
    externalId: V3_PRO_PILOT_EXTERNAL_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [{ id: V3_CERTIFICATION_CENTER_USER_ID }],
    isV3Pilot: true,
    complementaryCertificationIds,
    featureIds: [FEATURE_CAN_REGISTER_FOR_A_COMPLEMENTARY_CERTIFICATION_ALONE_ID],
  });
}

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
