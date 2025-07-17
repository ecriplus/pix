/**
 * @param {Object} params
 * @param {number} params.userId
 * @param {import('./index.js').certificationCourseRepository} params.certificationCourseRepository
 **/
const findUserCertificationCourses = async function ({ userId, certificationCourseRepository }) {
  return certificationCourseRepository.findAllByUserId({ userId });
};

export { findUserCertificationCourses };
