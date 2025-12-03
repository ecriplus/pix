import { FlashAssessmentAlgorithmConfiguration } from '../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';

export const buildFlashAlgorithmConfiguration = ({
  maximumAssessmentLength,
  challengesBetweenSameCompetence = 2,
  limitToOneQuestionPerTube,
  enablePassageByAllCompetences,
  variationPercent,
} = {}) => {
  return new FlashAssessmentAlgorithmConfiguration({
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
  });
};
