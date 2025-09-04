import { datamartBuffer } from '../datamart-buffer.js';

const buildDatamartActiveCalibratedChallenge = function ({
  calibrationId,
  challengeId,
  alpha = 1.3,
  delta = 4.1,
} = {}) {
  const values = {
    calibration_id: calibrationId,
    challenge_id: challengeId,
    alpha,
    delta,
  };

  return datamartBuffer.pushInsertable({
    tableName: 'data_active_calibrated_challenges',
    values,
  });
};

export { buildDatamartActiveCalibratedChallenge };
