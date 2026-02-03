import boom from '@hapi/boom';

import { usecases } from '../domain/usecases/index.js';

async function checkUserCanAccessCampaignParticipation(
  request,
  h,
  dependencies = { checkUserCanAccessCampaignParticipation: usecases.checkUserHasAccessToCampaignParticipation },
) {
  const userId = request.auth?.credentials?.userId;
  const campaignParticipationId = request.params?.campaignParticipationId;

  if (!userId || !campaignParticipationId) return boom.forbidden();

  const hasAccess = await dependencies.checkUserCanAccessCampaignParticipation({ userId, campaignParticipationId });

  if (!hasAccess) return boom.forbidden();

  return h.continue;
}

const campaignParticipationPreHandlers = {
  checkUserCanAccessCampaignParticipation,
};

export { campaignParticipationPreHandlers };
