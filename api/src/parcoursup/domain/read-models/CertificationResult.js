class CertificationResult {
  constructor({ ine, organizationUai, lastName, firstName, birthdate, status, pixScore, certificationDate }) {
    this.ine = ine;
    this.organizationUai = organizationUai;
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.status = status;
    this.pixScore = pixScore;
    this.certificationDate = certificationDate;
  }
}

export { CertificationResult };
