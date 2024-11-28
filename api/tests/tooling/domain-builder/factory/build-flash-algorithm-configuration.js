import { FlashAssessmentAlgorithmConfiguration } from '../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';

export const buildFlashAlgorithmConfiguration = ({
  forcedCompetences,
  maximumAssessmentLength,
  challengesBetweenSameCompetence,
  limitToOneQuestionPerTube,
  enablePassageByAllCompetences,
  variationPercent,
  variationPercentUntil,
  createdAt,
} = {}) => {
  return new FlashAssessmentAlgorithmConfiguration({
    forcedCompetences,
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
    variationPercentUntil,
    createdAt,
  });
};
