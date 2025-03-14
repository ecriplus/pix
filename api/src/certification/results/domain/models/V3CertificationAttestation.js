const PIX_COUNT_BY_LEVEL = 8;
const COMPETENCE_COUNT = 16;

class V3CertificationAttestation {
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    certificationCenter,
    deliveredAt,
    pixScore,
    maxReachableLevelOnCertificationDate,
    verificationCode,
  } = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.verificationCode = verificationCode;
    this.maxReachableScore = maxReachableLevelOnCertificationDate * PIX_COUNT_BY_LEVEL * COMPETENCE_COUNT;
  }
}

export { V3CertificationAttestation };
