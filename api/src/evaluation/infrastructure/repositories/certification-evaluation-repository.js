/**
 * @typedef {import ('./index.js').CertificationEvaluationApi} CertificationEvaluationApi
 */

/**
 * @function
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {string} params.locale
 * @param {CertificationEvaluationApi} params.certificationEvaluationApi
 *
 * @returns {Promise<void>}
 */
export const completeCertificationTest = async function ({
  certificationCourseId,
  locale,
  certificationEvaluationApi,
}) {
  return certificationEvaluationApi.completeCertificationTest({
    certificationCourseId,
    locale,
  });
};
