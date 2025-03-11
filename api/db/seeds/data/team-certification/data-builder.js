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
import { createCompetenceScoringConfiguration } from './create-competence-scoring-configuration.js';
import { proOrganizationWithCertifCenter } from './create-pro-organization-with-certif-center.js';
import { scoOrganizationManaginAgriStudentsWithFregata } from './create-sco-organization-managing-agri-student-with-fregata.js';
import { scoOrganizationNotManagingStudents } from './create-sco-organization-not-managing-students.js';
import { createScoringConfiguration } from './create-scoring-configuration.js';

async function teamCertificationDataBuilder({ databaseBuilder }) {
  await scoOrganizationManaginAgriStudentsWithFregata({ databaseBuilder });
  await proOrganizationWithCertifCenter({ databaseBuilder });
  await scoOrganizationNotManagingStudents({ databaseBuilder });
  _createV3CertificationConfiguration({ databaseBuilder });
  createCompetenceScoringConfiguration({ databaseBuilder });
  createScoringConfiguration({ databaseBuilder });
  await _createV3PilotCertificationCenter({ databaseBuilder });
  await _createSuccessCertifiableUser({ databaseBuilder });
  await _createIssueReportCategories({ databaseBuilder });
}

export { teamCertificationDataBuilder };

function _createV3CertificationConfiguration({ databaseBuilder }) {
  databaseBuilder.factory.buildFlashAlgorithmConfiguration({
    maximumAssessmentLength: 32,
    challengesBetweenSameCompetence: null,
    limitToOneQuestionPerTube: true,
    enablePassageByAllCompetences: true,
    variationPercent: 0.5,
    createdAt: new Date('1977-10-19'),
  });
}

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

async function _createIssueReportCategories({ databaseBuilder }) {
  const candidateInformationChangeId = databaseBuilder.factory.buildIssueReportCategory({
    name: 'CANDIDATE_INFORMATIONS_CHANGES',
    isDeprecated: false,
    isImpactful: false,
  }).id;

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'NAME_OR_BIRTHDATE',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: candidateInformationChangeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'EXTRA_TIME_PERCENTAGE',
    isDeprecated: false,
    isImpactful: false,
    issueReportCategoryId: candidateInformationChangeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'SIGNATURE_ISSUE',
    isDeprecated: false,
    isImpactful: false,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'FRAUD',
    isDeprecated: false,
    isImpactful: true,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'NON_BLOCKING_CANDIDATE_ISSUE',
    isDeprecated: false,
    isImpactful: false,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'NON_BLOCKING_TECHNICAL_ISSUE',
    isDeprecated: false,
    isImpactful: false,
  });

  const inChallengeId = databaseBuilder.factory.buildIssueReportCategory({
    name: 'IN_CHALLENGE',
    isDeprecated: false,
    isImpactful: false,
  }).id;

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'IMAGE_NOT_DISPLAYING',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'EMBED_NOT_WORKING',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'FILE_NOT_OPENING',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'WEBSITE_UNAVAILABLE',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'WEBSITE_BLOCKED',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'EXTRA_TIME_EXCEEDED',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'SOFTWARE_NOT_WORKING',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'UNINTENTIONAL_FOCUS_OUT',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'SKIP_ON_OOPS',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });

  databaseBuilder.factory.buildIssueReportCategory({
    name: 'ACCESSIBILITY_ISSUE',
    isDeprecated: false,
    isImpactful: true,
    issueReportCategoryId: inChallengeId,
  });
}
