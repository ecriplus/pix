import { databaseBuffer } from '../database-buffer.js';

/**
 * @deprecated replaced by buildCertificationConfiguration
 */
const buildFlashAlgorithmConfiguration = function ({
  maximumAssessmentLength = 20,
  challengesBetweenSameCompetence = null,
  limitToOneQuestionPerTube = null,
  enablePassageByAllCompetences = false,
  variationPercent = null,
  createdAt = new Date('2018-01-01'),
} = {}) {
  const values = {
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'flash-algorithm-configurations',
    values,
  });
};

export { buildFlashAlgorithmConfiguration };
