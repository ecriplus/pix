import { CertificationCenter } from '../../../../src/shared/domain/models/index.js';
import * as tooling from '../common/tooling/index.js';
import { acceptPixOrgaTermsOfService } from '../common/tooling/legal-documents.js';
import {
  complementaryCertificationIds,
  PRO_ADMIN_CERTIFICATION_CENTER_USER_ID,
  PRO_CERTIFICATION_CENTER_ID,
  PRO_EXTERNAL_ID,
  PRO_MEMBER_CERTIFICATION_CENTER_USER_ID,
  PRO_ORGANIZATION_ID,
  PRO_ORGANIZATION_USER_ID,
} from './constants.js';

export async function proOrganizationWithCertifCenter({ databaseBuilder }) {
  await _createProOrganization({ databaseBuilder });
  await _createProCertificationCenter({ databaseBuilder });
}
import { CERTIFICATION_CENTER_MEMBERSHIP_ROLES } from '../../../../src/shared/domain/models/CertificationCenterMembership.js';

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
    name: 'Orga pro team Certification',
    isManagingStudents: false,
    externalId: PRO_EXTERNAL_ID,
    adminIds: [PRO_ORGANIZATION_USER_ID],
    configOrganization: {
      learnerCount: 8,
    },
    withOrganizationLearners: false,
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
