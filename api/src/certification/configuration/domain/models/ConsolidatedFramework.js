/**
 * @typedef {import ('./CertificationFrameworksChallenge.js').CertificationFrameworksChallenge} CertificationFrameworksChallenge
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */

export class ConsolidatedFramework {
  /**
   * @param {Object} params
   * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
   * @param {String} params.version
   * @param {number} [params.calibrationId]
   * @param {Array<CertificationFrameworksChallenge>} [params.challenges]
   */
  constructor({ complementaryCertificationKey, version, calibrationId, challenges = [] }) {
    this.complementaryCertificationKey = complementaryCertificationKey;
    this.version = version;
    this.calibrationId = calibrationId;
    this.challenges = challenges;
  }
}
