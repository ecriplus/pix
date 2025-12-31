/**
 *
 * @typedef {import('./index.js').CertificationCandidateForSupervisingRepository} CertificationCandidateForSupervisingRepository
 */

/**
 * @param {object} params
 * @param {CertificationCandidateForSupervisingRepository} params.certificationCandidateForSupervisingRepository
 */
const authorizeCertificationCandidateToStart = async function ({
  certificationCandidateForSupervisingId,
  authorizedToStart,
  certificationCandidateForSupervisingRepository,
}) {
  await certificationCandidateForSupervisingRepository.update({
    id: certificationCandidateForSupervisingId,
    authorizedToStart,
  });
};

export { authorizeCertificationCandidateToStart };
