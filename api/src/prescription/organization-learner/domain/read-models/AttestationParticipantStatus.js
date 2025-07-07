export class AttestationParticipantStatus {
  constructor({ organizationLearnerId, firstName, lastName, division, obtainedAt, attestationKey }) {
    this.id = `${attestationKey}_${organizationLearnerId}`;
    this.organizationLearnerId = organizationLearnerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.division = division;
    this.obtainedAt = obtainedAt || null;
    this.attestationKey = attestationKey;
  }
}
