export const getCourseByOrganizationId = ({ organizationId, locale, courseRepository }) =>
  courseRepository.findByOrganizationId({ organizationId, locale });
