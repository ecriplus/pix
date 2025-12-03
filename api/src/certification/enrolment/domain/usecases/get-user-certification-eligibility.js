/**
 * @typedef {import ('./index.js').EligibilityService} EligibilityService
 */

/**
 * @param {Object} params
 * @param {EligibilityService} params.eligibilityService
 */
const getUserCertificationEligibility = async function ({
  userId,
  limitDate = new Date(),
  eligibilityService,
  placementProfileService,
  certificationBadgesService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) {
  return eligibilityService.getUserCertificationEligibility({
    userId,
    limitDate,
    placementProfileService,
    certificationBadgesService,
    complementaryCertificationCourseRepository,
    complementaryCertificationBadgeWithOffsetVersionRepository,
  });
};

export { getUserCertificationEligibility };
