/**
 * @typedef {import ('../../domain/usecases/index.js').ResultsCertificationCourseRepository} ResultsCertificationCourseRepository
 */

/**
 * @param {Object} params
 * @param {string} params.verificationCode
 * @param {ResultsCertificationCourseRepository} params.resultsCertificationCourseRepository
 */
export const getCertificationCourseByVerificationCode = async function ({
  verificationCode,
  resultsCertificationCourseRepository,
}) {
  return resultsCertificationCourseRepository.getByVerificationCode({ verificationCode });
};
