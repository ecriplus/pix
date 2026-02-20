import { CertificationChallengeCapacity } from '../../../../../../src/certification/evaluation/domain/models/CertificationChallengeCapacity.js';

export const buildCertificationChallengeCapacity = ({ answerId, certificationChallengeId, capacity, createdAt }) => {
  return new CertificationChallengeCapacity({
    answerId,
    certificationChallengeId,
    capacity,
    createdAt,
  });
};
