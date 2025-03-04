// TODO: bounded context violation
import { findIntervalIndexFromScore } from '../../../results/domain/services/find-interval-index-from-score.js';
import { CertificationAssessmentScoreV3 } from './CertificationAssessmentScoreV3.js';
import { Intervals } from './Intervals.js';
import { ScoringAndCapacitySimulatorReport } from './ScoringAndCapacitySimulatorReport.js';

// TODO change CapacitySimulator model to a service
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
