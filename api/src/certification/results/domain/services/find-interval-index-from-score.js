import { config } from '../../../../shared/config.js';
// TODO : bounded context violation
import { CertificationAssessmentScoreV3 } from '../../../scoring/domain/models/CertificationAssessmentScoreV3.js';

const SCORING_CONFIGURATION_WEIGHTS = CertificationAssessmentScoreV3.weightsAndCoefficients.map(({ weight }) => weight);

export function findIntervalIndexFromScore({ score }) {
  const weights = SCORING_CONFIGURATION_WEIGHTS;
  let cumulativeSumOfWeights = weights[0];
  let currentScoringInterval = 0;

  while (_hasNextScoringInterval(score, cumulativeSumOfWeights, currentScoringInterval)) {
    currentScoringInterval++;
    cumulativeSumOfWeights += weights[currentScoringInterval];
  }

  return currentScoringInterval;
}

function _hasNextScoringInterval(score, nextIntervalMinimumScore, currentInterval) {
  return score >= nextIntervalMinimumScore && currentInterval < config.v3Certification.maxReachableLevel;
}
