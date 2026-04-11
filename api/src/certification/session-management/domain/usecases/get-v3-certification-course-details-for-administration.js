export const getV3CertificationCourseDetailsForAdministration = async ({
  certificationCourseId,
  competenceRepository,
  v3CertificationCourseDetailsForAdministrationRepository,
  evaluationVersionRepository,
}) => {
  const competences = await competenceRepository.list();

  const courseDetails =
    await v3CertificationCourseDetailsForAdministrationRepository.getV3DetailsByCertificationCourseId({
      certificationCourseId,
    });

  const version = await evaluationVersionRepository.getById(courseDetails.versionId);

  courseDetails.numberOfChallenges = version.challengesConfiguration.maximumAssessmentLength;

  courseDetails.setCompetencesDetails(competences);

  return courseDetails;
};
