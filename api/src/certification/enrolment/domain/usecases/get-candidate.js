/**
 * @typedef {import('./index.js').CandidateRepository} CandidateRepository
 */

/**
 * @param {object} params
 * @param {CandidateRepository} params.candidateRepository
 */
export async function getCandidate({ certificationCandidateId, candidateRepository }) {
  return candidateRepository.get({ certificationCandidateId });
}
