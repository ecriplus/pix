import { config } from '../../../../shared/config.js';
import { CertificationAssessmentScoreV3 } from './CertificationAssessmentScoreV3.js';
import { Intervals } from './Intervals.js';
import { ScoringAndCapacitySimulatorReport } from './ScoringAndCapacitySimulatorReport.js';

const SCORING_CONFIGURATION_WEIGHTS = CertificationAssessmentScoreV3.weightsAndCoefficients.map(({ weight }) => weight);

// TODO change this model to a service
export class CapacitySimulator {
  static compute({ certificationScoringIntervals, competencesForScoring, score }) {
    const scoringIntervals = new Intervals({ intervals: certificationScoringIntervals });

    const { weightsAndCoefficients } = CertificationAssessmentScoreV3;
    const weights = weightsAndCoefficients.map(({ weight }) => weight);

    const intervalIndex = findIntervalIndexFromScore({
      score,
      weights,
      scoringIntervalsLength: scoringIntervals.length(),
    });

    const intervalMaxValue = scoringIntervals.max(intervalIndex);
    const intervalMinValue = scoringIntervals.min(intervalIndex);

    const intervalWeight = weightsAndCoefficients[intervalIndex].weight;
    const intervalCoefficient = weightsAndCoefficients[intervalIndex].coefficient;

    const capacity =
      (score / intervalWeight - intervalCoefficient) * (intervalMaxValue - intervalMinValue) + intervalMinValue;

    const competences = competencesForScoring.map(({ intervals, competenceCode }) => {
      const competenceIntervals = new Intervals({ intervals });
      return {
        competenceCode,
        level: intervals[competenceIntervals.findIntervalIndexFromCapacity(capacity)].competenceLevel,
      };
    });

    return new ScoringAndCapacitySimulatorReport({
      score,
      capacity,
      competences,
    });
  }
}

// TODO move this to result
// TODO Split this to a service
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
