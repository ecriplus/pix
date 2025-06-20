import _ from 'lodash';

import { databaseBuffer } from '../database-buffer.js';
import { buildComplementaryCertification } from './build-complementary-certification.js';
import { buildChallenge } from './learning-content/build-challenge.js';

const buildCertificationFrameworksChallenge = function ({
  id = databaseBuffer.getNextId(),
  alpha = 2.2,
  delta = 3.5,
  complementaryCertificationKey,
  challengeId,
} = {}) {
  complementaryCertificationKey = _.isUndefined(complementaryCertificationKey)
    ? buildComplementaryCertification().key
    : complementaryCertificationKey;

  challengeId = _.isUndefined(challengeId) ? buildChallenge().id : challengeId;

  const values = {
    id,
    alpha,
    delta,
    complementaryCertificationKey,
    challengeId,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-frameworks-challenges',
    values,
  });
};

export { buildCertificationFrameworksChallenge };
