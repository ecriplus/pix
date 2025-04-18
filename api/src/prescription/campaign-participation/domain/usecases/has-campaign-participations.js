import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

export const hasCampaignParticipations = withTransaction(async function ({ userId, campaignParticipationRepository }) {
  const campaignParticipationsCount = await campaignParticipationRepository.getCampaignParticipationsCountByUserId({
    userId,
  });
  return Boolean(campaignParticipationsCount);
});
