class UserCertificationEligibility {
  constructor({ id, isCertifiable, doubleCertificationEligibility }) {
    this.id = id;
    this.isCertifiable = isCertifiable;
    this.doubleCertificationEligibility = doubleCertificationEligibility;
  }
}

class CertificationEligibility {
  constructor({ label, imageUrl, isBadgeValid, validatedDoubleCertification }) {
    this.label = label;
    this.imageUrl = imageUrl;
    this.isBadgeValid = isBadgeValid;
    this.validatedDoubleCertification = validatedDoubleCertification;
  }
}

export { CertificationEligibility, UserCertificationEligibility };
