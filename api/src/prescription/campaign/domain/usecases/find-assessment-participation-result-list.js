const findAssessmentParticipationResultList = async ({
  campaignId,
  filters,
  page,
  campaignAssessmentParticipationResultListRepository,
}) => campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({ campaignId, filters, page });

export { findAssessmentParticipationResultList };
