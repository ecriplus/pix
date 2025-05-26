import dayjs from 'dayjs';

import { Candidate } from '../../../../../src/certification/enrolment/domain/models/Candidate.js';
import { Subscription } from '../../../../../src/certification/enrolment/domain/models/Subscription.js';
import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';
import { BILLING_MODES } from '../../../../../src/certification/shared/domain/constants.js';
import { usecases as organizationalEntitiesUsecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import {
  CertificationCenter,
  types as certificationCenterTypes,
} from '../../../../../src/shared/domain/models/CertificationCenter.js';
import { normalize } from '../../../../../src/shared/infrastructure/utils/string-utils.js';
import { usecases as teamUsecases } from '../../../../../src/team/domain/usecases/index.js';
import {
  PRO_CERTIFICATION_CENTER_EXTERNAL_ID,
  PRO_CERTIFICATION_CENTER_ID,
  PUBLISHED_PRO_SESSION,
  STARTED_PRO_SESSION,
} from '../constants.js';
import { CommonCertifiableUser } from '../shared/common-certifiable-user.js';
import { CommonPixCertifOrganization } from '../shared/common-organisation.js';
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
 *    - Pix Certif user : certif-prescriptor@example.net
 *    - Pix App user    : certifiable-pro@example.net
 *    - Pix Admin user  : superadmin@example.net
 *    - Pix Orga user   : certif-prescriptor@example.net
 */
export class ProSeed {
  constructor({ databaseBuilder }) {
    this.databaseBuilder = databaseBuilder;
  }

  async #addOrganization() {
    const commonOrgaService = await CommonPixCertifOrganization.getInstance({ databaseBuilder: this.databaseBuilder });
    return commonOrgaService.organizationMember;
  }

  async #addCertifCenter({ organizationMember }) {
    const certificationCenter = await organizationalEntitiesUsecases.createCertificationCenter({
      certificationCenter: new CertificationCenter({
        id: PRO_CERTIFICATION_CENTER_ID,
        name: 'PRO Certification Center',
        type: certificationCenterTypes.PRO,
        externalId: PRO_CERTIFICATION_CENTER_EXTERNAL_ID,
        createdAt: new Date('2022-01-30'),
        habilitations: [],
        isV3Pilot: true,
      }),
      complementaryCertificationIds: [],
    });

    await teamUsecases.createCertificationCenterMembershipByEmail({
      certificationCenterId: certificationCenter.id,
      email: organizationMember.email,
    });

    return certificationCenter;
  }

  async #addCertifiableUser() {
    const certifiableUserService = await CommonCertifiableUser.getInstance({ databaseBuilder: this.databaseBuilder });
    return certifiableUserService.certifiableUser;
  }

  async create() {
    const organizationMember = await this.#addOrganization();
    const certificationCenter = await this.#addCertifCenter({ organizationMember });
    const certifiableUser = await this.#addCertifiableUser();

    await this.databaseBuilder.commit();

    // Transform this user into a certification candidate
    const candidate = new Candidate({
      authorizedToStart: true,
      firstName: certifiableUser.firstName,
      lastName: certifiableUser.lastName,
      sex: 'F',
      birthdate: new Date('2000-10-30'),
      birthCountry: 'France',
      birthINSEECode: '75115',
      email: certifiableUser.email,
      isLinked: true,
      hasSeenCertificationInstructions: false,
      accessibilityAdjustmentNeeded: false,
      subscriptions: [Subscription.buildCore({ certificationCandidateId: null })],
      userId: certifiableUser.id,
      billingMode: BILLING_MODES.FREE,
    });

    /**
     * 4. Initialize session with candidates ready to enter the certification
     */

    const startedProSession = await enrolmentUseCases.createSession({
      userId: organizationMember.id,
      session: {
        certificationCenterId: certificationCenter.id,
        address: 'Lyon',
        room: '69A',
        examiner: 'Jean Prea-demarrer',
        date: '2024-02-11',
        time: '09:10',
        description: 'PRO session with candidate ready to start',
      },
    });
    await this.databaseBuilder.knex('sessions').where('id', startedProSession.id).update({
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
        certificationCenterId: certificationCenter.id,
        address: 'Lyon',
        room: '69A',
        examiner: 'Anne-Cess Ionfinie',
        date: dayjs().format('YYYY-MM-DD'),
        time: '16:30',
        description: 'PRO session with published results',
      },
    });
    await this.databaseBuilder.knex('sessions').where('id', publishedScoSession.id).update({
      id: PUBLISHED_PRO_SESSION,
      accessCode: 'AZERTY',
    });

    const publishedScoCandidateId = await enrolmentUseCases.addCandidateToSession({
      sessionId: PUBLISHED_PRO_SESSION,
      candidate: new Candidate(candidate), // Warning: usecase modifies the entry model...
      normalizeStringFnc: normalize,
    });

    await publishSessionWithValidatedCertification({
      databaseBuilder: this.databaseBuilder,
      sessionId: PUBLISHED_PRO_SESSION,
      candidateId: publishedScoCandidateId,
      pixScoreTarget: 250,
    });
  }
}
