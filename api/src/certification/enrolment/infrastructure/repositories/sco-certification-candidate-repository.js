// @ts-check
/**
 * @typedef {import ('../../domain/models/SCOCertificationCandidate.js').SCOCertificationCandidate} SCOCertificationCandidate
 */

import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { SUBSCRIPTION_TYPES } from '../../../shared/domain/constants.js';

/**
 * @function
 * @param {object} params
 * @param {number} params.sessionId
 * @param {Array<SCOCertificationCandidate>} params.scoCertificationCandidates
 * @returns {Promise<void>}
 */
const addNonEnrolledCandidatesToSession = async function ({ sessionId, scoCertificationCandidates }) {
  const knexConn = DomainTransaction.getConnection();

  const organizationLearnerIds = scoCertificationCandidates.map((candidate) => candidate.organizationLearnerId);

  const alreadyEnrolledCandidates = await knexConn
    .select(['organizationLearnerId'])
    .from('certification-candidates')
    .whereIn('organizationLearnerId', organizationLearnerIds)
    .where({ sessionId });

  const alreadyEnrolledCandidateOrganizationLearnerIds = new Set(
    alreadyEnrolledCandidates.map((c) => c.organizationLearnerId),
  );

  const scoCandidateToDTO = _scoCandidateToDTOForSession(sessionId);
  const candidateDTOs = scoCertificationCandidates
    .filter((candidate) => !alreadyEnrolledCandidateOrganizationLearnerIds.has(candidate.organizationLearnerId))
    .map(scoCandidateToDTO);

  if (candidateDTOs.length === 0) return;

  // We voluntarily keep the transaction contained in the repository as the usecase initiate a lengthy treatment
  await DomainTransaction.execute(async () => {
    const trxConn = DomainTransaction.getConnection();
    const insertedCandidateDTOs = await trxConn('certification-candidates').insert(candidateDTOs).returning(['id']);

    const subscriptionDTOs = insertedCandidateDTOs.map((insertedCandidateDTO) => ({
      certificationCandidateId: insertedCandidateDTO.id,
      type: SUBSCRIPTION_TYPES.CORE,
    }));
    await trxConn('certification-subscriptions').insert(subscriptionDTOs);
  });
};

export { addNonEnrolledCandidatesToSession };

/**
 * @typedef {object} SCOCertificationCandidateDTO
 * @property {string} firstName
 * @property {string} lastName
 * @property {Date} birthdate
 * @property {string} organizationLearnerId
 * @property {string} sex
 * @property {string} birthINSEECode
 * @property {string} birthCity
 * @property {string} birthCountry
 * @property {number} sessionId
 */

/**
 * @function
 * @param {number} sessionId
 * @returns {function(SCOCertificationCandidate): SCOCertificationCandidateDTO}
 */
function _scoCandidateToDTOForSession(sessionId) {
  return (scoCandidate) => ({
    firstName: scoCandidate.firstName,
    lastName: scoCandidate.lastName,
    birthdate: scoCandidate.birthdate,
    organizationLearnerId: scoCandidate.organizationLearnerId,
    sex: scoCandidate.sex,
    birthINSEECode: scoCandidate.birthINSEECode,
    birthCity: scoCandidate.birthCity,
    birthCountry: scoCandidate.birthCountry,
    sessionId,
  });
}
