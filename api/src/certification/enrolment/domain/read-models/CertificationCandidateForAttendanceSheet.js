class CertificationCandidateForAttendanceSheet {
  constructor({ lastName, firstName, birthdate, externalId, division, extraTimePercentage }) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.externalId = externalId;
    this.division = division;
    this.extraTimePercentage = extraTimePercentage != null ? parseFloat(extraTimePercentage) : extraTimePercentage;
  }
}

export { CertificationCandidateForAttendanceSheet };
