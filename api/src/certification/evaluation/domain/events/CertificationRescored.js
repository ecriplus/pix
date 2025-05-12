import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

export default class CertificationRescored {
  /**
   * @param {Object} params
   * @param {number} params.certificationCourseId - certification course that will be rescored
   * @param {number} params.juryId - ID of the jury member that performs the rescoring action
   */
  constructor({ certificationCourseId, juryId }) {
    assertNotNullOrUndefined(certificationCourseId);
    this.certificationCourseId = certificationCourseId;
    this.juryId = juryId;
  }
}
