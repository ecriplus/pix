import { FlashAssessmentAlgorithmConfiguration } from '../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';

export const buildFlashAlgorithmConfiguration = ({
  maximumAssessmentLength = 32,
  challengesBetweenSameCompetence = 2,
  limitToOneQuestionPerTube = false,
  enablePassageByAllCompetences = false,
  variationPercent = 0.25,
} = {}) => {
  return new FlashAssessmentAlgorithmConfiguration({
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
  });
};
