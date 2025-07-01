import _ from 'lodash';

import { databaseBuffer } from '../database-buffer.js';
import { buildComplementaryCertification } from './build-complementary-certification.js';
import { buildChallenge } from './learning-content/build-challenge.js';

const buildCertificationFrameworksChallenge = function ({
  id = databaseBuffer.getNextId(),
  discriminant = 2.2,
  difficulty = 3.5,
  complementaryCertificationKey,
  challengeId,
  calibrationId,
  createdAt = new Date(),
} = {}) {
  complementaryCertificationKey = _.isUndefined(complementaryCertificationKey)
    ? buildComplementaryCertification().key
    : complementaryCertificationKey;

  challengeId = _.isUndefined(challengeId) ? buildChallenge().id : challengeId;

  const values = {
    id,
    discriminant,
    difficulty,
    complementaryCertificationKey,
    challengeId,
    calibrationId,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-frameworks-challenges',
    values,
  });
};

export { buildCertificationFrameworksChallenge };
