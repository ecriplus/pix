import { knex } from '../../../../../db/knex-database-connection.js';
import { SUBSCRIPTION_TYPES } from '../../../shared/domain/constants.js';

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

    const allSubscriptionsDTO = [];
    const complementaryCertifications = await trx('complementary-certifications').select('*');

    for (const candidateDTO of candidatesToBeEnrolledDTOs) {
      const subscriptions = candidateDTO.subscriptions;
      delete candidateDTO.subscriptions;

      const [{ id }] = await trx('certification-candidates').insert(candidateDTO).returning('id');

      for (const subscriptionDTO of subscriptions) {
        subscriptionDTO.certificationCandidateId = id;
        subscriptionDTO.complementaryCertificationId =
          subscriptionDTO.type === SUBSCRIPTION_TYPES.CORE
            ? null
            : complementaryCertifications.find(({ key }) => key === subscriptionDTO.complementaryCertificationKey)?.id;

        delete subscriptionDTO.complementaryCertificationKey;

        allSubscriptionsDTO.push(subscriptionDTO);
      }
    }
    await knex.batchInsert('certification-subscriptions', allSubscriptionsDTO).transacting(trx);
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
      subscriptions: scoCandidate.subscriptions.map((sub) => ({
        type: sub.type,
        complementaryCertificationKey: sub.complementaryCertificationKey,
      })),
    };
  };
}
