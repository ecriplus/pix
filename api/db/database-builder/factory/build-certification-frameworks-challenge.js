import _ from 'lodash';

import { databaseBuffer } from '../database-buffer.js';
import { buildComplementaryCertification } from './build-complementary-certification.js';
import { buildChallenge } from './learning-content/index.js';

const buildCertificationFrameworksChallenge = function ({
  id = databaseBuffer.getNextId(),
  discriminant = 2.2,
  difficulty = 3.5,
  complementaryCertificationKey,
  challengeId,
  calibrationId,
  createdAt = new Date('2020-01-01'),
  version = getVersionNumber(createdAt),
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
    version,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-frameworks-challenges',
    values,
  });
};

function getVersionNumber(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getSeconds())
  );
}

export { buildCertificationFrameworksChallenge };
