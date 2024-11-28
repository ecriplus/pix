import { config } from '../../../src/shared/config.js';
import { databaseBuffer } from '../database-buffer.js';

const buildFlashAlgorithmConfiguration = function ({
  maximumAssessmentLength = config.v3Certification.numberOfChallengesPerCourse,
  challengesBetweenSameCompetence = null,
  limitToOneQuestionPerTube = null,
  enablePassageByAllCompetences = false,
  variationPercent = null,
  variationPercentUntil = null,
  createdAt = new Date(),
} = {}) {
  const values = {
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
    variationPercentUntil,
    createdAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'flash-algorithm-configurations',
    values,
  });
};

export { buildFlashAlgorithmConfiguration };
