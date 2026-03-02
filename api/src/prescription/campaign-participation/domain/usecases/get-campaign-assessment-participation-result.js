import { UserNotAuthorizedToAccessEntityError } from '../../../../shared/domain/errors.js';

const getCampaignAssessmentParticipationResult = async function ({
  userId,
  campaignId,
  campaignParticipationId,
  campaignRepository,
  campaignAssessmentParticipationResultRepository,
  campaignParticipationRepository,
  locale,
} = {}) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  const participation = await campaignParticipationRepository.get(campaignParticipationId);
  if (!participation.isShared) {
    throw new UserNotAuthorizedToAccessEntityError('Campaign participation is not shared yet');
  }

  return campaignAssessmentParticipationResultRepository.getByCampaignIdAndCampaignParticipationId({
    campaignId,
    campaignParticipationId,
    locale,
  });
};

export { getCampaignAssessmentParticipationResult };
