/**
 * @typedef {import ('./CertificationFrameworksChallenge.js').CertificationFrameworksChallenge} CertificationFrameworksChallenge
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */

export class ConsolidatedFramework {
  /**
   * @param {Object} params
   * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
   * @param {Date} params.createdAt
   * @param {number} [params.calibrationId]
   * @param {Array<CertificationFrameworksChallenge>} [params.challenges]
   */
  constructor({ complementaryCertificationKey, createdAt, calibrationId, challenges = [] }) {
    this.complementaryCertificationKey = complementaryCertificationKey;
    this.createdAt = createdAt;
    this.calibrationId = calibrationId;
    this.challenges = challenges;
  }
}
