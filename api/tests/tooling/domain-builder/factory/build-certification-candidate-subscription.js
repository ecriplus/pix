import { CertificationCandidateSubscription } from '../../../../src/certification/enrolment/domain/read-models/CertificationCandidateSubscription.js';

const buildCertificationCandidateSubscription = function ({
  id = 1234,
  sessionId = 1234,
  enrolledDoubleCertificationLabel = null,
  doubleCertificationEligibility = false,
} = {}) {
  return new CertificationCandidateSubscription({
    id,
    sessionId,
    enrolledDoubleCertificationLabel,
    doubleCertificationEligibility,
  });
};

export { buildCertificationCandidateSubscription };
