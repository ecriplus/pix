/**
 * @typedef {import('./index.js').CandidateRepository} CandidateRepository
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import { CertificationCandidateForbiddenDeletionError } from '../errors.js';

/**
 * @param {object} params
 * @param {CandidateRepository} params.candidateRepository
 */
const deleteUnlinkedCertificationCandidate = withTransaction(async ({ candidateId, candidateRepository }) => {
  const candidate = await candidateRepository.get({ certificationCandidateId: candidateId });

  if (!candidate) {
    throw new NotFoundError();
  }

  if (!candidate.isReconciled()) {
    return candidateRepository.remove({ id: candidateId });
  }

  throw new CertificationCandidateForbiddenDeletionError();
});

export { deleteUnlinkedCertificationCandidate };
