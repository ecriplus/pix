export class AttestationUserDetail {
  constructor({ id, attestationKey, obtainedAt, userId } = {}) {
    this.id = id;
    this.attestationKey = attestationKey;
    this.userId = userId;
    this.obtainedAt = obtainedAt;
  }
}
