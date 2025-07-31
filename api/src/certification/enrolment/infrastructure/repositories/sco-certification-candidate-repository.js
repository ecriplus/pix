import { knex } from '../../../../../db/knex-database-connection.js';
import { Subscription } from '../../domain/models/Subscription.js';

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
      .map(scoCandidateToDTO);

    for (const candidateDTO of candidatesToBeEnrolledDTOs) {
      const subscriptions = candidateDTO.subscriptions;
      delete candidateDTO.subscriptions;

      const [{ id }] = await trx('certification-candidates').insert(candidateDTO).returning('id');

      subscriptions[0].certificationCandidateId = id;
      delete subscriptions[0].complementaryCertificationKey;

      await trx('certification-subscriptions').insert(subscriptions[0]);
    }
  });
};

export { addNonEnrolledCandidatesToSession };

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
