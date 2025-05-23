import dayjs from 'dayjs';

import { Candidate } from '../../../../../src/certification/enrolment/domain/models/Candidate.js';
import { Subscription } from '../../../../../src/certification/enrolment/domain/models/Subscription.js';
import { usecases as enrolmentUseCases } from '../../../../../src/certification/enrolment/domain/usecases/index.js';
import { usecases as organizationalEntitiesUsecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import {
  CertificationCenter,
  types as certificationCenterTypes,
} from '../../../../../src/shared/domain/models/CertificationCenter.js';
import { LANGUAGES_CODE } from '../../../../../src/shared/domain/services/language-service.js';
import { normalize } from '../../../../../src/shared/infrastructure/utils/string-utils.js';
import { usecases as teamUsecases } from '../../../../../src/team/domain/usecases/index.js';
import * as tooling from '../../common/tooling/index.js';
import {
  PUBLISHED_SCO_SESSION,
  SCO_CERTIFICATION_CENTER_EXTERNAL_ID,
  SCO_CERTIFICATION_CENTER_ID,
  STARTED_SCO_SESSION,
} from '../constants.js';
import { CommonPixCertifOrganization } from '../shared/common-organisation.js';
import publishSessionWithValidatedCertification from '../tools/create-published-session-with-certification.js';

/**
 * --- CERTIFICATION CASE ---
 *
 * The goal here is to reproduce the most simple certification case:
 *   - I'm a SCO user with a certifiable account
 *   - I'm able to start a certification course
 *   - The organization is SCO and managing students
 *
 *  Quick start :
 *    - Pix Certif user : sco-managing-students-v3@example.net
 *    - Pix App user    : certifiable-sco-user@example.net
 *    - Pix Admin user    : superadmin@example.net
 *    - Pix Orga user   : certif-pix-orga-member@example.net
 */
export class ScoManagingStudent {
  organization;
  organizationMember;
  organizationMembership;

  constructor({ databaseBuilder }) {
    this.databaseBuilder = databaseBuilder;
  }

  async create() {
    const { organization, organizationMember } = await this.#addOrganization();
    const { certificationCenter } = await this.#addCertifCenter({ organizationMember });
    const { certifiableUser } = await this.#addCertifiableUser({ organization });

    /**
     * Session with candidat ready to start his certification
     */
    const sessionReadyToStart = await this.#addReadyToStartSession({
      certificationCenterMember: organizationMember,
      certificationCenter,
    });
    await this.#addCandidateToSession({ pixAppUser: certifiableUser, session: sessionReadyToStart });

    /**
     * Session with a published certification
     */
    const sessionToPublish = await this.#addSessionToPublish({
      certificationCenterMember: organizationMember,
      certificationCenter,
    });
    const candidateToPublish = await this.#addCandidateToSession({
      pixAppUser: certifiableUser,
      session: sessionToPublish,
    });

    await publishSessionWithValidatedCertification({
      databaseBuilder: this.databaseBuilder,
      sessionId: PUBLISHED_SCO_SESSION,
      candidateId: candidateToPublish.id,
      pixScoreTarget: 550,
    });
  }

  async #addOrganization() {
    const useCommonOrga = await CommonPixCertifOrganization.getInstance({ databaseBuilder: this.databaseBuilder });
    this.organization = useCommonOrga.organization;
    this.organizationMember = useCommonOrga.organizationMember;
    this.organizationMembership = useCommonOrga.organizationMembership;
  }

  async create() {
    await this.#addOrganization();

    // Certification center
    const certificationCenter = new CertificationCenter({
      id: SIMPLE_SCO_CERTIFICATION_CENTER_ID,
      name: 'Sco Certification Center #1',
      type: certificationCenterTypes.SCO,
      externalId: SCO_CERTIFICATION_CENTER_EXTERNAL_ID,
      createdAt: new Date('2022-01-30'),
      habilitations: [],
    });

    const certificationCenterForAdmin = await organizationalEntitiesUsecases.createCertificationCenter({
      certificationCenter,
      complementaryCertificationIds: [],
    });

    await teamUsecases.createCertificationCenterMembershipForScoOrganizationAdminMember({
      membership: this.organizationMembership,
    });

    /**
     * 2. Create the certifiable user
     */
    const scoUser = this.databaseBuilder.factory.buildUser.withRawPassword({
      id: SIMPLE_SCO_CERTIFICATION_USER_ID,
      firstName: 'SCO-user',
      lastName: 'Certifiable',
      email: 'certifiable-sco-user@example.net',
      cgu: true,
      lang: LANGUAGES_CODE.FRENCH,
      lastTermsOfServiceValidatedAt: new Date(),
    });

    await tooling.profile.createCertifiableProfile({
      databaseBuilder: this.databaseBuilder,
      userId: scoUser.id,
    });

    const organizationLearner = this.databaseBuilder.factory.buildOrganizationLearner({
      userId: scoUser.id,
      organizationId: this.organization.id,
      firstName: scoUser.firstName,
      lastName: scoUser.lastName,
      email: scoUser.email,
      division: 'Terminal',
      sex: 'F',
      birthdate: '2000-01-01',
      isCertifiable: true,
      isDisabled: false,
      certifiableAt: new Date('2022-01-30'),
    });

    for (let index = 0; index < 10; index++) {
      const otherUser = this.databaseBuilder.factory.buildUser.withRawPassword({
        firstName: `Élève-${index}`,
        lastName: `Dummy`,
        email: `dummy-sco-user_${index}@example.net`,
        cgu: true,
        lang: LANGUAGES_CODE.FRENCH,
      });
      this.databaseBuilder.factory.buildOrganizationLearner({
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        sex: 'M',
        birthdate: '2000-01-01',
        birthCity: null,
        birthCityCode: '75115',
        birthCountryCode: '100',
        birthProvinceCode: null,
        division: '6eme',
        isDisabled: false,
        organizationId: this.organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.databaseBuilder.factory.buildOrganizationLearner({
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        sex: 'M',
        birthdate: '2000-01-01',
        birthCity: null,
        birthCityCode: '75115',
        birthCountryCode: '100',
        birthProvinceCode: null,
        division: 'Terminal',
        isDisabled: false,
        organizationId: this.organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await this.databaseBuilder.commit();

    // Transform this user into a certification candidate
    const candidate = new Candidate({
      authorizedToStart: true,
      organizationLearnerId: organizationLearner.id,
      firstName: organizationLearner.firstName,
      lastName: organizationLearner.lastName,
      sex: organizationLearner.sex,
      birthdate: organizationLearner.birthdate,
      birthCountry: 'France',
      birthINSEECode: '75115',
      email: organizationLearner.email,
      isLinked: true,
      hasSeenCertificationInstructions: false,
      accessibilityAdjustmentNeeded: false,
      subscriptions: [Subscription.buildCore({ certificationCandidateId: null })],
      userId: scoUser.id,
    });

    /**
     * 4. Initialize session with candidates ready to enter the certification
     */

    const startedScoSession = await enrolmentUseCases.createSession({
      userId: this.organizationMember.id,
      session: {
        certificationCenterId: certificationCenterForAdmin.id,
        address: 'Rennes',
        room: '28D',
        examiner: 'Jean Prea-demarrer',
        date: '2024-01-30',
        time: '14:30',
        description: 'SCO session with candidates ready to start',
      },
    });
    await this.databaseBuilder.knex('sessions').where('id', startedScoSession.id).update({
      id: STARTED_SCO_SESSION,
      accessCode: 'AZERTY',
    });

    await enrolmentUseCases.addCandidateToSession({
      sessionId: STARTED_SCO_SESSION,
      candidate: new Candidate(candidate), // Warning: usecase modifies the entry model...
      normalizeStringFnc: normalize,
    });

    /**
     * 5. Initialize session that have been published
     */

    const publishedScoSession = await enrolmentUseCases.createSession({
      userId: this.organizationMember.id,
      session: {
        certificationCenterId: certificationCenterForAdmin.id,
        address: 'Montpellier',
        room: '9C',
        examiner: 'Anne-Cess Ionfinie',
        date: dayjs().format('YYYY-MM-DD'),
        time: '12:30',
        description: 'SCO session with published results',
      },
    });
    await this.databaseBuilder.knex('sessions').where('id', publishedScoSession.id).update({
      id: PUBLISHED_SCO_SESSION,
      accessCode: 'AZERTY',
    });

    const publishedScoCandidateId = await enrolmentUseCases.addCandidateToSession({
      sessionId: PUBLISHED_SCO_SESSION,
      candidate: new Candidate(candidate), // Warning: usecase modifies the entry model...
      normalizeStringFnc: normalize,
    });

    await publishSessionWithValidatedCertification({
      databaseBuilder: this.databaseBuilder,
      sessionId: PUBLISHED_SCO_SESSION,
      candidateId: publishedScoCandidateId,
      pixScoreTarget: 550,
    });
  }
}
