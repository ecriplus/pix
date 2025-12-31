/**
 * @typedef {import('./index.js').CertificationCandidateRepository} CertificationCandidateRepository
 * @typedef {import('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import('./index.js').VersionRepository} VersionRepository
 */

/**
 * @param {object} params
 * @param {number} params.certificationCourseId
 * @param {CertificationCandidateRepository} params.certificationCandidateRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {VersionRepository} params.versionRepository
 */
const getCertificationCourse = async function ({
  certificationCourseId,
  sharedCertificationCandidateRepository,
  certificationCourseRepository,
  versionRepository,
}) {
  const certificationCourse = await certificationCourseRepository.get({ id: certificationCourseId });

  if (certificationCourse.isV3()) {
    const candidate = await sharedCertificationCandidateRepository.getBySessionIdAndUserId({
      sessionId: certificationCourse.getSessionId(),
      userId: certificationCourse.getUserId(),
    });

    const scope = await certificationCourseRepository.getCertificationScope({ courseId: certificationCourseId });

    const version = await versionRepository.getByScopeAndReconciliationDate({
      scope,
      reconciliationDate: candidate.reconciledAt,
    });

    certificationCourse.setNumberOfChallenges(version.challengesConfiguration.maximumAssessmentLength);
  }

  return certificationCourse;
};

export { getCertificationCourse };
