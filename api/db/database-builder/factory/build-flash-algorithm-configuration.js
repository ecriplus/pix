import { config } from '../../../src/shared/config.js';
import { databaseBuffer } from '../database-buffer.js';

const buildFlashAlgorithmConfiguration = function ({
  forcedCompetences = [],
  maximumAssessmentLength = config.v3Certification.numberOfChallengesPerCourse,
  challengesBetweenSameCompetence = null,
  minimumEstimatedSuccessRateRanges = [],
  limitToOneQuestionPerTube = null,
  enablePassageByAllCompetences = false,
  variationPercent = null,
  variationPercentUntil = null,
  createdAt = new Date(),
} = {}) {
  const values = {
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    forcedCompetences: JSON.stringify(forcedCompetences),
    minimumEstimatedSuccessRateRanges: JSON.stringify(minimumEstimatedSuccessRateRanges),
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
