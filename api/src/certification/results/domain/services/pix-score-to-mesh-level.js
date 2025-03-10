/**
 * @typedef {import ('../../../shared/domain/models/V3CertificationScoring.js').V3CertificationScoring} V3CertificationScoring
 */

import { GlobalCertificationLevel } from '../../../shared/domain/models/GlobalCertificationLevel.js';
import { findIntervalIndexFromScore } from './find-interval-index-from-score.js';

/**
 * @param {Object} params
 * @param {number} params.pixScore
 */
export const getMeshLevel = ({ pixScore }) => {
  return new GlobalCertificationLevel({
    meshLevel: findIntervalIndexFromScore({
      score: pixScore,
    }),
  });
};
