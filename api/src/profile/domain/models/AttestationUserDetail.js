export class AttestationUserDetail {
  constructor({ attestationKey, obtainedAt, userId } = {}) {
    this.attestationKey = attestationKey;
    this.userId = userId;
    this.obtainedAt = obtainedAt;
  }
}
