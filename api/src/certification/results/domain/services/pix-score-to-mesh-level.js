/**
 * @typedef {import ('../../../shared/domain/models/V3CertificationScoring.js').V3CertificationScoring} V3CertificationScoring
 */

import { findIntervalIndexFromScore } from '../../../scoring/domain/models/CapacitySimulator.js';
// TODO : bounded context violation
import { CertificationAssessmentScoreV3 } from '../../../scoring/domain/models/CertificationAssessmentScoreV3.js';
import { GlobalCertificationLevel } from '../../../shared/domain/models/GlobalCertificationLevel.js';

const SCORING_CONFIGURATION_WEIGHT = CertificationAssessmentScoreV3.weightsAndCoefficients.map(({ weight }) => weight);

/**
 * @param {Object} params
 * @param {number} params.pixScore
 * @param {V3CertificationScoring} params.scoringConfiguration
 */
export const getMeshLevel = ({ pixScore, scoringConfiguration }) => {
  return new GlobalCertificationLevel({
    meshLevel: findIntervalIndexFromScore({
      score: pixScore,
      weights: SCORING_CONFIGURATION_WEIGHT,
      scoringIntervalsLength: scoringConfiguration.getNumberOfIntervals(),
    }),
  });
};
