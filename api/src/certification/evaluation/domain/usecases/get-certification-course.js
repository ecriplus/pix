/**
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').VersionApi} VersionApi
 */

/**
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {VersionApi} params.versionApi
 */
export async function getCertificationCourse({ certificationCourseId, certificationCourseRepository, versionApi }) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });

  if (certificationCourse.isV3()) {
    const version = await versionApi.getById({ id: certificationCourse.versionId });
    certificationCourse.setNumberOfChallenges(version.challengesConfiguration.maximumAssessmentLength);
  }

  return certificationCourse;
}
