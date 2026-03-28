/**
 * @typedef {import ('./index.js').CertificationEvaluationApi} CertificationEvaluationApi
 */

import { addCorrelationInfo } from '../../../shared/infrastructure/execution-context-manager.js';
import { SCOPES } from '../../../shared/infrastructure/utils/logger.js';

/**
 * @function
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {string} params.locale
 * @param {CertificationEvaluationApi} params.certificationEvaluationApi
 *
 * @returns {Promise<void>}
 */
export const completeCertificationAssessment = async function ({
  certificationCourseId,
  locale,
  certificationEvaluationApi,
}) {
  addCorrelationInfo('certificationId', certificationCourseId);
  addCorrelationInfo('scope', SCOPES.CERTIFICATION);
  return certificationEvaluationApi.completeCertificationAssessment({
    certificationCourseId,
    locale,
  });
};
