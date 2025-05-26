import dayjs from 'dayjs';

import { Candidate } from '../../../../../src/certification/enrolment/domain/models/Candidate.js';
import { CenterTypes } from '../../../../../src/certification/enrolment/domain/models/CenterTypes.js';
import { Subscription } from '../../../../../src/certification/enrolment/domain/models/Subscription.js';
import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';
import { BILLING_MODES } from '../../../../../src/certification/shared/domain/constants.js';
import { OrganizationForAdmin } from '../../../../../src/organizational-entities/domain/models/OrganizationForAdmin.js';
import { usecases as organizationalEntitiesUsecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import * as organizationCreationValidator from '../../../../../src/organizational-entities/domain/validators/organization-creation-validator.js';
import {
  CertificationCenter,
  types as certificationCenterTypes,
} from '../../../../../src/shared/domain/models/CertificationCenter.js';
import { Membership } from '../../../../../src/shared/domain/models/Membership.js';
import { LANGUAGES_CODE } from '../../../../../src/shared/domain/services/language-service.js';
import { normalize } from '../../../../../src/shared/infrastructure/utils/string-utils.js';
import { usecases as teamUsecases } from '../../../../../src/team/domain/usecases/index.js';
import * as tooling from '../../common/tooling/index.js';
import { acceptPixOrgaTermsOfService } from '../../common/tooling/legal-documents.js';
import {
  CERTIFICATION_PRO_EXTERNAL_ID,
  PRO_CERTIFICATION_CENTER_ID,
  PRO_ORGANIZATION_USER_ID,
  PUBLISHED_PRO_SESSION,
  SIMPLE_PRO_CERTIFICATION_USER_ID,
  STARTED_PRO_SESSION,
} from '../constants.js';
import publishSessionWithValidatedCertification from '../tools/create-published-session-with-certification.js';

/**
 * --- CERTIFICATION CASE ---
 *
 * The goal here is to reproduce one certification case:
 *   - The organization is PRO
 *   - A session with several candidates
 *   - The candidate can directly enter a session on Pix App
 *
 *  Quick start :
 *    - Pix Certif user : pro-v3@example.net
 *    - Pix App user    : certifiable-pro@example.net
 *    - Pix Admin user  : superadmin@example.net
 *    - Pix Orga user   : pro-v3@example.net
 */

export default async function proCertificationCase({ databaseBuilder }) {
  /**
   * 1. Create the certification center and organization
   */
  const externalId = CERTIFICATION_PRO_EXTERNAL_ID;

  const organizationMember = databaseBuilder.factory.buildUser.withRawPassword({
    id: PRO_ORGANIZATION_USER_ID,
    firstName: 'Pro',
    lastName: 'Organization member',
    email: 'pro-v3@example.net',
    cgu: true,
    lang: LANGUAGES_CODE.FRENCH,
    lastTermsOfServiceValidatedAt: new Date(),
    mustValidateTermsOfService: false,
    pixCertifTermsOfServiceAccepted: true,
  });

  acceptPixOrgaTermsOfService(databaseBuilder, organizationMember.id);

  await databaseBuilder.commit();

  // Organization
  const organization = new OrganizationForAdmin({
    name: 'Certification PRO organization',
    type: CenterTypes.PRO,
    isManagingStudents: false,
    externalId,
  });

  const newOrga = await organizationalEntitiesUsecases.createOrganization({
    organization,
    organizationCreationValidator,
  });

  await teamUsecases.createMembership({
    organizationRole: Membership.roles.ADMIN,
    userId: organizationMember.id,
    organizationId: newOrga.id,
  });

  // Certification center
  const certificationCenter = new CertificationCenter({
    id: PRO_CERTIFICATION_CENTER_ID,
    name: 'PRO Certification Center',
    type: certificationCenterTypes.PRO,
    externalId,
    createdAt: new Date('2022-01-30'),
    habilitations: [],
    isV3Pilot: true,
  });

  const certificationCenterForAdmin = await organizationalEntitiesUsecases.createCertificationCenter({
    certificationCenter,
    complementaryCertificationIds: [],
  });

  await teamUsecases.createCertificationCenterMembershipByEmail({
    certificationCenterId: certificationCenterForAdmin.id,
    email: organizationMember.email,
  });

  /**
   * 2. Create the certifiable users
   */
  const userAbleToStartCertification = databaseBuilder.factory.buildUser.withRawPassword({
    id: SIMPLE_PRO_CERTIFICATION_USER_ID,
    firstName: 'PRO-user',
    lastName: 'Certifiable',
    email: 'certifiable-pro@example.net',
    cgu: true,
    lang: LANGUAGES_CODE.FRENCH,
    lastTermsOfServiceValidatedAt: new Date(),
  });

  await tooling.profile.createCertifiableProfile({
    databaseBuilder,
    userId: userAbleToStartCertification.id,
  });

  await databaseBuilder.commit();

  // Transform this user into a certification candidate
  const candidate = new Candidate({
    authorizedToStart: true,
    firstName: userAbleToStartCertification.firstName,
    lastName: userAbleToStartCertification.lastName,
    sex: 'F',
    birthdate: new Date('2000-10-30'),
    birthCountry: 'France',
    birthINSEECode: '75115',
    email: userAbleToStartCertification.email,
    isLinked: true,
    hasSeenCertificationInstructions: false,
    accessibilityAdjustmentNeeded: false,
    subscriptions: [Subscription.buildCore({ certificationCandidateId: null })],
    userId: userAbleToStartCertification.id,
    billingMode: BILLING_MODES.FREE,
  });

  /**
   * 4. Initialize session with candidates ready to enter the certification
   */

  const startedProSession = await enrolmentUseCases.createSession({
    userId: organizationMember.id,
    session: {
      certificationCenterId: certificationCenterForAdmin.id,
      address: 'Lyon',
      room: '69A',
      examiner: 'Jean Prea-demarrer',
      date: '2024-02-11',
      time: '09:10',
      description: 'PRO session with candidate ready to start',
    },
  });
  await databaseBuilder.knex('sessions').where('id', startedProSession.id).update({
    id: STARTED_PRO_SESSION,
    accessCode: 'AZERTY',
  });

  await enrolmentUseCases.addCandidateToSession({
    sessionId: STARTED_PRO_SESSION,
    candidate: new Candidate(candidate), // Warning: usecase modifies the entry model...
    normalizeStringFnc: normalize,
  });

  /**
   * 5. Initialize session that have been published
   */

  const publishedScoSession = await enrolmentUseCases.createSession({
    userId: organizationMember.id,
    session: {
      certificationCenterId: certificationCenterForAdmin.id,
      address: 'Lyon',
      room: '69A',
      examiner: 'Anne-Cess Ionfinie',
      date: dayjs().format('YYYY-MM-DD'),
      time: '16:30',
      description: 'PRO session with published results',
    },
  });
  await databaseBuilder.knex('sessions').where('id', publishedScoSession.id).update({
    id: PUBLISHED_PRO_SESSION,
    accessCode: 'AZERTY',
  });

  const publishedScoCandidateId = await enrolmentUseCases.addCandidateToSession({
    sessionId: PUBLISHED_PRO_SESSION,
    candidate: new Candidate(candidate), // Warning: usecase modifies the entry model...
    normalizeStringFnc: normalize,
  });

  await publishSessionWithValidatedCertification({
    databaseBuilder,
    sessionId: PUBLISHED_PRO_SESSION,
    candidateId: publishedScoCandidateId,
    pixScoreTarget: 250,
  });
}
