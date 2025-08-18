import { CertificationCandidateSubscription } from '../read-models/CertificationCandidateSubscription.js';

const getCertificationCandidateSubscription = async function ({
  certificationCandidateId,
  certificationBadgesService,
  certificationCandidateRepository,
  certificationCenterRepository,
}) {
  const certificationCandidate = await certificationCandidateRepository.getWithComplementaryCertification({
    id: certificationCandidateId,
  });

  if (!certificationCandidate.isEnrolledToDoubleCertification()) {
    return _emptyCertificationCandidateSubscription(certificationCandidate);
  }

  const center = await certificationCenterRepository.getBySessionId({
    sessionId: certificationCandidate.sessionId,
  });

  if (!center.isHabilitated(certificationCandidate.complementaryCertification.key)) {
    return _emptyCertificationCandidateSubscription(certificationCandidate);
  }

  const certifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId: certificationCandidate.userId,
    limitDate: certificationCandidate.reconciledAt,
  });

  const [doubleCertificationCertifiableBadgeAcquisition] = certifiableBadgeAcquisitions.filter(
    (certifiableBadgeAcquisition) =>
      certifiableBadgeAcquisition.complementaryCertificationKey ===
      certificationCandidate.complementaryCertification.key,
  );

  if (!doubleCertificationCertifiableBadgeAcquisition) {
    return _uneligibleCertificationCandidateSubscription(certificationCandidate);
  }

  return _eligibleCertificationCandidateSubscriptions(certificationCandidate);
};

function _emptyCertificationCandidateSubscription(candidate) {
  return new CertificationCandidateSubscription({
    id: candidate.id,
    sessionId: candidate.sessionId,
    enrolledDoubleCertificationLabel: null,
    doubleCertificationEligibility: false,
  });
}

function _uneligibleCertificationCandidateSubscription(candidate) {
  return new CertificationCandidateSubscription({
    id: candidate.id,
    sessionId: candidate.sessionId,
    enrolledDoubleCertificationLabel: candidate.complementaryCertification.label,
    doubleCertificationEligibility: false,
  });
}

function _eligibleCertificationCandidateSubscriptions(candidate) {
  return new CertificationCandidateSubscription({
    id: candidate.id,
    sessionId: candidate.sessionId,
    enrolledDoubleCertificationLabel: candidate.complementaryCertification.label,
    doubleCertificationEligibility: true,
  });
}

export { getCertificationCandidateSubscription };
