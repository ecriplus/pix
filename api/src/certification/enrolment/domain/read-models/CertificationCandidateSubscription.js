class CertificationCandidateSubscription {
  constructor({ id, sessionId, enrolledDoubleCertificationLabel, doubleCertificationEligibility }) {
    this.id = id;
    this.sessionId = sessionId;
    this.enrolledDoubleCertificationLabel = enrolledDoubleCertificationLabel;
    this.doubleCertificationEligibility = doubleCertificationEligibility;
  }
}

export { CertificationCandidateSubscription };
