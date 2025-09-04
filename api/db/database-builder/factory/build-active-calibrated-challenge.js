import { databaseBuffer } from '../database-buffer.js';

const buildActiveCalibratedChallenge = function ({ challengeId, alpha = 1.3, delta = 4.1 } = {}) {
  const values = {
    challengeId,
    alpha,
    delta,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-data-active-calibrated-challenges',
    values,
  });
};

export { buildActiveCalibratedChallenge };
