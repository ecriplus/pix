export async function getJuryCertification ({ certificationCourseId, juryCertificationRepository }) {
  return juryCertificationRepository.get({ certificationCourseId });
};
