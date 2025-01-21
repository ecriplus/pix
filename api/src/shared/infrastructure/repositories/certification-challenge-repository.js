/**
 * @typedef {import ('./index.js').CertificationEvaluationApi} CertificationEvaluationApi
 * @typedef {import ('../../domain/models/Challenge.js').Challenge} Challenge
 * @typedef {import ('../../domain/errors.js').AssessmentEndedError} AssessmentEndedError
 */

/**
 * @function
 * @param {Object} params
 * @param {number} params.assessmentId - certification assessment id
 * @param {string} params.locale - candidate locale
 * @param {CertificationEvaluationApi} params.certificationEvaluationApi
 *
 * @returns {Challenge}
 * @throws {AssessmentEndedError} test ended or no next challenge available
 */
export const selectNextCertificationChallenge = async function ({ assessmentId, locale, certificationEvaluationApi }) {
  return certificationEvaluationApi.selectNextCertificationChallenge({
    assessmentId,
    locale,
  });
};
