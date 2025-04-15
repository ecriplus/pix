import { usecases } from '../domain/usecases/index.js';

export async function getCampaignParticipations(
  request,
  h,
  dependencies = { getCampaignParticipations: usecases.getCampaignParticipations },
) {
  const campaignParticipations = await dependencies.getCampaignParticipations({
    campaignId: request.params.campaignId,
    clientId: request.auth.credentials.client_id,
  });
  return h.response(campaignParticipations).code(200);
}
