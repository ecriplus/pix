class UserCertificationEligibility {
  constructor({ id, isCertifiable, doubleCertificationEligibility }) {
    this.id = id;
    this.isCertifiable = isCertifiable;
    this.doubleCertificationEligibility = doubleCertificationEligibility;
  }
}

class CertificationEligibility {
  constructor({ label, imageUrl, isBadgeOutdated, validatedDoubleCertification }) {
    this.label = label;
    this.imageUrl = imageUrl;
    this.isBadgeOutdated = isBadgeOutdated;
    this.validatedDoubleCertification = validatedDoubleCertification;
  }
}

export { CertificationEligibility, UserCertificationEligibility };
