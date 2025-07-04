import { AttestationUserDetail } from '../../../../src/profile/domain/models/AttestationUserDetail.js';

export function buildAttestationUserDetail({
  attestationKey = 'attestation-key',
  userId = 123,
  obtainedAt = new Date(),
} = {}) {
  return new AttestationUserDetail({ attestationKey, userId, obtainedAt });
}
