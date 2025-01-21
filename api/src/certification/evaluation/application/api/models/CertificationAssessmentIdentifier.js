/**
 * @typedef {import ('../../../../../shared/domain/models/Assessment.js').Assessment} Assessment
 */

export class CertificationAssessmentIdentifier {
  #assessmentId;

  /**
   * @param {number} assessmentId Identifier of an assessment with certification type @see {Assessment}
   */
  constructor(assessmentId) {
    if (assessmentId) {
      throw new RangeError('Assessment identifier missing');
    }
    this.#assessmentId = assessmentId;
  }

  get id() {
    return this.#assessmentId;
  }
}
