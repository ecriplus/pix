export const getV3CertificationCourseDetailsForAdministration = async ({
  certificationCourseId,
  competenceRepository,
  v3CertificationCourseDetailsForAdministrationRepository,
  certificationCandidateRepository,
  sharedCertificationCourseRepository,
  evaluationVersionRepository,
}) => {
  const competences = await competenceRepository.list();

  const courseDetails =
    await v3CertificationCourseDetailsForAdministrationRepository.getV3DetailsByCertificationCourseId({
      certificationCourseId,
    });

  const candidate = await certificationCandidateRepository.getByCertificationCourseId({ certificationCourseId });

  const scope = await sharedCertificationCourseRepository.getCertificationScope({ courseId: certificationCourseId });

  const version = await evaluationVersionRepository.getByScopeAndReconciliationDate({
    scope,
    reconciliationDate: candidate.reconciledAt,
  });

  courseDetails.numberOfChallenges = version.challengesConfiguration.maximumAssessmentLength;

  courseDetails.setCompetencesDetails(competences);

  return courseDetails;
};
