import { knex } from '../../../../../db/knex-database-connection.js';
import { ChallengeCalibration } from '../../../scoring/domain/read-models/ChallengeCalibration.js';

export const getByCertificationCourseId = async ({ certificationCourseId }) => {
  const challengeCalibrations = await knex('certification-challenges')
    .select({
      challengeId: 'challengeId',
      discriminant: 'discriminant',
      difficulty: 'difficulty',
      certificationChallengeId: 'id',
    })
    .where({ courseId: certificationCourseId })
    .orderBy('createdAt', 'asc');

  return _toDomain(challengeCalibrations);
};

function _toDomain(challengeCalibrations) {
  return challengeCalibrations.map((challengeCalibration) => {
    return new ChallengeCalibration({
      ...challengeCalibration,
      id: challengeCalibration.challengeId,
    });
  });
}
