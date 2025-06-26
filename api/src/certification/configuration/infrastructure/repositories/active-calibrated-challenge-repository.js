import { knex as datamartKnex } from '../../../../../datamart/knex-database-connection.js';
import { ActiveCalibratedChallenge } from '../../domain/read-models/ActiveCalibratedChallenge.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKey} params.complementaryCertificationKey
 * @param {number} params.calibrationId
 * @returns {Promise<Array<ActiveCalibratedChallenge>>}
 */
export async function findByComplementaryKeyAndCalibrationId({ complementaryCertificationKey, calibrationId }) {
  const activeCalibratedChallengesDTO = await datamartKnex('active_calibrated_challenges')
    .select('scope', 'alpha as discriminant', 'delta as difficulty', 'challenge_id as challengeId')
    .where({
      scope: complementaryCertificationKey,
      calibration_id: calibrationId,
    })
    .orderBy('challengeId');

  return activeCalibratedChallengesDTO.map((activeCalibratedChallenge) => toDomain({ activeCalibratedChallenge }));
}

function toDomain({ activeCalibratedChallenge }) {
  return new ActiveCalibratedChallenge(activeCalibratedChallenge);
}
