/**
 * @typedef {import('./index.js').CandidateRepository} CandidateRepository
 */

/**
 * @param {object} params
 * @param {number} params.userId
 * @param {CandidateRepository} params.candidateRepository
 */
export async function hasBeenCandidate({ userId, candidateRepository }) {
  const candidates = await candidateRepository.findByUserId({ userId });
  return candidates.some((candidate) => candidate.isReconciled());
}
