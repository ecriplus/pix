import { SCOCertificationCandidate } from '../../../../src/certification/enrolment/domain/models/SCOCertificationCandidate.js';
import { Frameworks } from '../../../../src/certification/shared/domain/models/Frameworks.js';
import { domainBuilder } from '../domain-builder.js';

const buildSCOCertificationCandidate = function ({
  id = 123,
  firstName = 'Myriam',
  lastName = 'Meilleure',
  birthdate = '2006-06-06',
  sex = 'F',
  birthINSEECode = '66001',
  sessionId = 456,
  organizationLearnerId = 789,
  subscriptions = [domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId: null })],
  subscription = Frameworks.CORE,
} = {}) {
  return new SCOCertificationCandidate({
    id,
    firstName,
    lastName,
    birthdate,
    sex,
    birthINSEECode,
    sessionId,
    organizationLearnerId,
    subscriptions,
    subscription,
  });
};

export { buildSCOCertificationCandidate };
