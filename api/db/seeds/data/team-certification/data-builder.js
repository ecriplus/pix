import { CERTIFICATION_CENTER_MEMBERSHIP_ROLES } from '../../../../src/shared/domain/models/CertificationCenterMembership.js';
import { CertificationCenter } from '../../../../src/shared/domain/models/index.js';
import {
  CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
} from '../common/complementary-certification-builder.js';
import { COLLEGE_TAG, FEATURE_CAN_REGISTER_FOR_A_COMPLEMENTARY_CERTIFICATION_ALONE_ID } from '../common/constants.js';
import * as tooling from '../common/tooling/index.js';
import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';
import { createCompetenceScoringConfiguration } from './create-competence-scoring-configuration.js';
import { createScoringConfiguration } from './create-scoring-configuration.js';

const TEAM_CERTIFICATION_OFFSET_ID = 7000;
// IDS
/// USERS
const TEAM_CERTIFICATION_OFFSET_ID_USERS = TEAM_CERTIFICATION_OFFSET_ID + 100;
const SCO_CERTIFICATION_MANAGING_STUDENTS_ORGANIZATION_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS;
const SCO_CERTIFICATION_MANAGING_STUDENTS_CERTIFICATION_CENTER_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 1;
const PRO_ADMIN_CERTIFICATION_CENTER_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 2;
const PRO_ORGANIZATION_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 3;
const V3_CERTIFICATION_CENTER_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 4;
const CERTIFIABLE_SUCCESS_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 5;
const PRO_MEMBER_CERTIFICATION_CENTER_USER_ID = TEAM_CERTIFICATION_OFFSET_ID_USERS + 6;
/// ORGAS
const TEAM_CERTIFICATION_OFFSET_ID_ORGAS = TEAM_CERTIFICATION_OFFSET_ID + 200;
const SCO_MANAGING_STUDENTS_ORGANIZATION_ID = TEAM_CERTIFICATION_OFFSET_ID_ORGAS;
const PRO_ORGANIZATION_ID = TEAM_CERTIFICATION_OFFSET_ID_ORGAS + 1;
/// CERTIFICATION CENTERS
const TEAM_CERTIFICATION_OFFSET_ID_CENTERS = TEAM_CERTIFICATION_OFFSET_ID + 300;
const SCO_CERTIFICATION_CENTER_ID = TEAM_CERTIFICATION_OFFSET_ID_CENTERS + 1;
const PRO_CERTIFICATION_CENTER_ID = TEAM_CERTIFICATION_OFFSET_ID_CENTERS + 2;
const V3_CERTIFICATION_CENTER_ID = TEAM_CERTIFICATION_OFFSET_ID_CENTERS + 3;
const PRO_PILOT_CERTIFICATION_CENTER_ID = TEAM_CERTIFICATION_OFFSET_ID_CENTERS + 4;
/// EXTERNAL IDS
const CERTIFICATION_SCO_MANAGING_STUDENTS_EXTERNAL_ID = 'CERTIFICATION_SCO_MANAGING_STUDENTS_EXTERNAL_ID';
const PRO_EXTERNAL_ID = 'PRO_EXTERNAL_ID';
const V3_PRO_PILOT_EXTERNAL_ID = 'V3_PRO_PILOT_EXTERNAL_ID';
// SESSION IDS
const complementaryCertificationIds = [
  CLEA_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_DROIT_COMPLEMENTARY_CERTIFICATION_ID,
  PIX_EDU_1ER_DEGRE_COMPLEMENTARY_CERTIFICATION_ID,
];

async function teamCertificationDataBuilder({ databaseBuilder }) {
  await _createScoOrganization({ databaseBuilder });
  await _createScoCertificationCenter({ databaseBuilder });
  await _createProOrganization({ databaseBuilder });
  await _createProCertificationCenter({ databaseBuilder });
  _createV3CertificationConfiguration({ databaseBuilder });
  createCompetenceScoringConfiguration({ databaseBuilder });
  createScoringConfiguration({ databaseBuilder });
  await _createV3PilotCertificationCenter({ databaseBuilder });
  await _createSuccessCertifiableUser({ databaseBuilder });
  await _createIssueReportCategories({ databaseBuilder });
}

export { teamCertificationDataBuilder };

async function _createScoCertificationCenter({ databaseBuilder }) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: SCO_CERTIFICATION_MANAGING_STUDENTS_CERTIFICATION_CENTER_USER_ID,
    firstName: 'Centre de certif SCO managing student',
    lastName: 'Certification',
    email: 'certif-sco-v3@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, SCO_CERTIFICATION_MANAGING_STUDENTS_CERTIFICATION_CENTER_USER_ID);

  await tooling.certificationCenter.createCertificationCenter({
    databaseBuilder,
    certificationCenterId: SCO_CERTIFICATION_CENTER_ID,
    name: 'Centre de certification sco managing students',
    type: CertificationCenter.types.SCO,
    externalId: CERTIFICATION_SCO_MANAGING_STUDENTS_EXTERNAL_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [{ id: SCO_CERTIFICATION_MANAGING_STUDENTS_CERTIFICATION_CENTER_USER_ID }],
    complementaryCertificationIds: [],
    isV3Pilot: true,
  });
}

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

async function _createProCertificationCenter({ databaseBuilder }) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: PRO_ADMIN_CERTIFICATION_CENTER_USER_ID,
    firstName: 'PRO',
    lastName: 'ADMIN',
    email: 'certif-pro@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, PRO_ADMIN_CERTIFICATION_CENTER_USER_ID);

  databaseBuilder.factory.buildUser.withRawPassword({
    id: PRO_MEMBER_CERTIFICATION_CENTER_USER_ID,
    firstName: 'PRO',
    lastName: 'MEMBER',
    email: 'certif-pro-member@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, PRO_MEMBER_CERTIFICATION_CENTER_USER_ID);

  await tooling.certificationCenter.createCertificationCenter({
    databaseBuilder,
    certificationCenterId: PRO_CERTIFICATION_CENTER_ID,
    name: 'Centre de certification pro',
    type: CertificationCenter.types.PRO,
    externalId: PRO_EXTERNAL_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      { id: PRO_ADMIN_CERTIFICATION_CENTER_USER_ID, role: CERTIFICATION_CENTER_MEMBERSHIP_ROLES.ADMIN },
      { id: PRO_MEMBER_CERTIFICATION_CENTER_USER_ID, role: CERTIFICATION_CENTER_MEMBERSHIP_ROLES.MEMBER },
    ],
    complementaryCertificationIds,
  });
}

async function _createScoOrganization({ databaseBuilder }) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: SCO_CERTIFICATION_MANAGING_STUDENTS_ORGANIZATION_USER_ID,
    firstName: 'Orga SCO managing Student',
    lastName: 'Certification',
    email: 'orga-sco-managing-students@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, SCO_CERTIFICATION_MANAGING_STUDENTS_ORGANIZATION_USER_ID);

  await tooling.organization.createOrganization({
    databaseBuilder,
    organizationId: SCO_MANAGING_STUDENTS_ORGANIZATION_ID,
    type: 'SCO',
    name: 'Orga team Certification',
    isManagingStudents: true,
    externalId: CERTIFICATION_SCO_MANAGING_STUDENTS_EXTERNAL_ID,
    adminIds: [SCO_CERTIFICATION_MANAGING_STUDENTS_ORGANIZATION_USER_ID],
    configOrganization: {
      learnerCount: 8,
    },
    tagIds: [COLLEGE_TAG.id],
  });
}

async function _createProOrganization({ databaseBuilder }) {
  databaseBuilder.factory.buildUser.withRawPassword({
    id: PRO_ORGANIZATION_USER_ID,
    firstName: 'Orga Pro',
    lastName: 'Certification',
    email: 'orga-pro@example.net',
    cgu: true,
    lang: 'fr',
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: false,
    hasSeenAssessmentInstructions: false,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, PRO_ORGANIZATION_USER_ID);

  await tooling.organization.createOrganization({
    databaseBuilder,
    organizationId: PRO_ORGANIZATION_ID,
    type: 'PRO',
    name: 'Orga team Certification',
    isManagingStudents: false,
    externalId: PRO_EXTERNAL_ID,
    adminIds: [PRO_ORGANIZATION_USER_ID],
    configOrganization: {
      learnerCount: 8,
    },
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
