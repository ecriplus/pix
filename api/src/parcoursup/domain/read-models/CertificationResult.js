class CertificationResult {
  constructor({
    ine,
    organizationUai,
    lastName,
    firstName,
    birthdate,
    status,
    pixScore,
    certificationDate,
    competences,
  }) {
    this.ine = ine;
    this.organizationUai = organizationUai;
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.status = status;
    this.pixScore = pixScore;
    this.certificationDate = certificationDate;
    this.competences = competences;
  }
}

export { CertificationResult };
