/**
 * @typedef {import ('../../../shared/domain/models/V3CertificationScoring.js').V3CertificationScoring} V3CertificationScoring
 */

// TODO : bounded context violation
import { findIntervalIndexFromScore } from '../../../scoring/domain/models/CapacitySimulator.js';
import { GlobalCertificationLevel } from '../../../shared/domain/models/GlobalCertificationLevel.js';

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
