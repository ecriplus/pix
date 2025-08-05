import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';
import { CertificationCandidateSubscription } from '../read-models/CertificationCandidateSubscription.js';

const getCertificationCandidateSubscription = async function ({
  certificationCandidateId,
  certificationBadgesService,
  certificationCandidateRepository,
  centerRepository,
  sessionRepository,
}) {
  const certificationCandidate = await certificationCandidateRepository.getWithComplementaryCertification({
    id: certificationCandidateId,
  });

  const session = await sessionRepository.get({ id: certificationCandidate.sessionId });

  if (!certificationCandidate.complementaryCertification) {
    return _emptyCertificationCandidateSubscription(certificationCandidate, session);
  }

  const center = await centerRepository.getById({
    id: session.certificationCenterId,
  });

  if (!center.isHabilitated(certificationCandidate.complementaryCertification.key)) {
    return _emptyCertificationCandidateSubscription(certificationCandidate, session);
  }

  let eligibleSubscriptions = [];
  let nonEligibleSubscription = null;
  const certifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId: certificationCandidate.userId,
    limitDate: certificationCandidate.reconciledAt,
  });

  const [doubleCertificationCertifiableBadgeAcquisition] = certifiableBadgeAcquisitions.filter(
    (certifiableBadgeAcquisition) =>
      certifiableBadgeAcquisition.complementaryCertificationKey === ComplementaryCertificationKeys.CLEA,
  );

  if (
    !doubleCertificationCertifiableBadgeAcquisition &&
    certificationCandidate.complementaryCertification.key === ComplementaryCertificationKeys.CLEA
  ) {
    return _uneligibleCertificationCandidateSubscription(certificationCandidate, session);
  }

  if (!doubleCertificationCertifiableBadgeAcquisition) {
    return _emptyCertificationCandidateSubscription(certificationCandidate, session);
  }

  const isSubscriptionEligible =
    doubleCertificationCertifiableBadgeAcquisition.complementaryCertificationKey ===
    certificationCandidate.complementaryCertification.key;

  if (isSubscriptionEligible) {
    eligibleSubscriptions = certificationCandidate.subscriptions.map((subscription) => {
      return {
        label: subscription.type === 'COMPLEMENTARY' ? certificationCandidate.complementaryCertification.label : null,
        type: subscription.type,
      };
    });
  } else {
    nonEligibleSubscription = certificationCandidate.complementaryCertification;
  }

  return new CertificationCandidateSubscription({
    id: certificationCandidateId,
    sessionId: certificationCandidate.sessionId,
    eligibleSubscriptions,
    nonEligibleSubscription,
    sessionVersion: session.version,
  });
};

function _emptyCertificationCandidateSubscription(candidate, session) {
  return new CertificationCandidateSubscription({
    id: candidate.id,
    sessionId: candidate.sessionId,
    eligibleSubscriptions: [],
    nonEligibleSubscription: null,
    sessionVersion: session.version,
  });
}

function _uneligibleCertificationCandidateSubscription(candidate, session) {
  return new CertificationCandidateSubscription({
    id: candidate.id,
    sessionId: candidate.sessionId,
    eligibleSubscriptions: [],
    nonEligibleSubscription: {
      label: candidate.complementaryCertification.label,
      type: 'COMPLEMENTARY',
    },
    sessionVersion: session.version,
  });
}

export { getCertificationCandidateSubscription };
