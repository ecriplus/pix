import { findIntervalIndexFromScore } from '../../../../../../src/certification/results/domain/services/find-interval-index-from-score.js';
import { CertificationAssessmentScoreV3 } from '../../../../../../src/certification/scoring/domain/models/CertificationAssessmentScoreV3.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | CapacitySimulator', function () {
  describe('#findIntervalIndexFromScore', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        score: 0,
        expectedInterval: 0,
      },
      {
        score: 64,
        expectedInterval: 1,
      },
      {
        score: 200,
        expectedInterval: 2,
      },
      {
        score: 896,
        expectedInterval: 7,
      },
    ].forEach(({ score, expectedInterval }) => {
      it(`returns the interval ${expectedInterval} when score is ${score}`, function () {
        const certificationScoringIntervals = [
          { bounds: { max: -2, min: -8 }, meshLevel: 0 }, // Score de 0 à 63
          { bounds: { max: -0.5, min: -2 }, meshLevel: 1 }, // Score de 64 à 127
          { bounds: { max: 0.6, min: -0.5 }, meshLevel: 2 }, // score de 128 à 255
          { bounds: { max: 1.5, min: 0.6 }, meshLevel: 3 }, // score de 256 à 383
          { bounds: { max: 2.25, min: 1.5 }, meshLevel: 4 }, // score de 384 à 511
          { bounds: { max: 3.1, min: 2.25 }, meshLevel: 5 }, // score de 512 à 639
          { bounds: { max: 4, min: 3.1 }, meshLevel: 6 }, // score de 640 à 767
          { bounds: { max: 8, min: 4 }, meshLevel: 7 }, // score de 768 à 895
        ];
        // when
        const weights = CertificationAssessmentScoreV3.weightsAndCoefficients.map(({ weight }) => weight);
        const result = findIntervalIndexFromScore({
          score,
          weights,
          scoringIntervalsLength: certificationScoringIntervals.length,
        });

        // then
        expect(result).to.equal(expectedInterval);
      });
    });
  });
});
