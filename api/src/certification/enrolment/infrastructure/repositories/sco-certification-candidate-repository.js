// @ts-check
/**
 * @typedef {import ('../../domain/models/SCOCertificationCandidate.js').SCOCertificationCandidate} SCOCertificationCandidate
 */

import { knex } from '../../../../../db/knex-database-connection.js';
import { Subscription } from '../../domain/models/Subscription.js';

// I LET IT THAT WAY. THE TRANSACTION IS CONTAINED HERE IN THE USECASE THAT USES IT
// USECASE IS A SEMI-LONG RUNNING WORK (enroll a lot of students at once)
/**
 * @function
 * @param {object} params
 * @param {number} params.sessionId
 * @param {Array<SCOCertificationCandidate>} params.scoCertificationCandidates
 * @returns {Promise<void>}
 */
const addNonEnrolledCandidatesToSession = async function ({ sessionId, scoCertificationCandidates }) {
  await knex.transaction(async (trx) => {
    const organizationLearnerIds = scoCertificationCandidates.map((candidate) => candidate.organizationLearnerId);

    const alreadyEnrolledCandidate = await trx
      .select(['organizationLearnerId'])
      .from('certification-candidates')
      .whereIn('organizationLearnerId', organizationLearnerIds)
      .where({ sessionId });

    const alreadyEnrolledCandidateOrganizationLearnerIds = alreadyEnrolledCandidate.map(
      (candidate) => candidate.organizationLearnerId,
    );

    const scoCandidateToDTO = _scoCandidateToDTOForSession(sessionId);
    const candidatesToBeEnrolledDTOs = scoCertificationCandidates
      .filter((candidate) => !alreadyEnrolledCandidateOrganizationLearnerIds.includes(candidate.organizationLearnerId))
      .map((candidate) => scoCandidateToDTO(candidate));

    for (const candidateDTO of candidatesToBeEnrolledDTOs) {
      const { subscriptions, ...candidateToInsert } = candidateDTO;

      const [{ id }] = await trx('certification-candidates').insert(candidateToInsert).returning('id');

      subscriptions[0].certificationCandidateId = id;
      // eslint-disable-next-line no-unused-vars
      const { complementaryCertificationKey, ...subscriptionToInsert } = subscriptions[0];

      await trx('certification-subscriptions').insert(subscriptionToInsert);
    }
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
 * @property {Array<Subscription>} subscriptions
 */

/**
 * @function
 * @param {number} sessionId
 * @returns {function(SCOCertificationCandidate): SCOCertificationCandidateDTO}
 */
function _scoCandidateToDTOForSession(sessionId) {
  return (scoCandidate) => {
    return {
      firstName: scoCandidate.firstName,
      lastName: scoCandidate.lastName,
      birthdate: scoCandidate.birthdate,
      organizationLearnerId: scoCandidate.organizationLearnerId,
      sex: scoCandidate.sex,
      birthINSEECode: scoCandidate.birthINSEECode,
      birthCity: scoCandidate.birthCity,
      birthCountry: scoCandidate.birthCountry,
      sessionId,
      subscriptions: [Subscription.buildCore({ certificationCandidateId: null })],
    };
  };
}
