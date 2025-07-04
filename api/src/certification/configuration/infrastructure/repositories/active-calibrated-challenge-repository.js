/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */
import { knex as datamartKnex } from '../../../../../datamart/knex-database-connection.js';
import { ActiveCalibratedChallenge } from '../../domain/read-models/ActiveCalibratedChallenge.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {number} params.calibrationId
 * @returns {Promise<Array<ActiveCalibratedChallenge>>}
 */
export async function findByComplementaryKeyAndCalibrationId({ complementaryCertificationKey, calibrationId }) {
  const activeCalibratedChallengesDTO = await datamartKnex('data_active_calibrated_challenges')
    .select('scope', 'alpha as discriminant', 'delta as difficulty', 'challenge_id as challengeId')
    .innerJoin('data_calibrations', 'data_active_calibrated_challenges.calibration_id', 'data_calibrations.id')
    .where({
      calibration_id: calibrationId,
      scope: complementaryCertificationKey,
    })
    .orderBy('challengeId');

  return activeCalibratedChallengesDTO.map((activeCalibratedChallenge) => toDomain({ activeCalibratedChallenge }));
}

function toDomain({ activeCalibratedChallenge }) {
  return new ActiveCalibratedChallenge(activeCalibratedChallenge);
}
