import { AssessmentParticipationResultFilterError } from '../errors.js';

async function findAssessmentParticipationResultList({
  campaignId,
  filters,
  page,
  campaignAssessmentParticipationResultListRepository,
}) {
  if (filters?.badges?.some((id) => filters?.unacquiredBadges?.includes(id))) {
    throw new AssessmentParticipationResultFilterError();
  }
  return campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({ campaignId, filters, page });
}

export { findAssessmentParticipationResultList };
