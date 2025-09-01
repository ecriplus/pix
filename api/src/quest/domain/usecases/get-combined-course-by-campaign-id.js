export async function findCombinedCourseByCampaignId({ campaignId, combinedCourseRepository }) {
  return combinedCourseRepository.findByCampaignId({ campaignId });
}
