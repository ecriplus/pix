import { CampaignParticipation } from '../models/CampaignParticipation.js';
import { TubeCoverage } from '../models/TubeCoverage.js';

const getExternalIdentifierByUserId = async (
  campaignId,
  participations,
  organizationRepository,
  authenticationMethodRepository,
) => {
  const identityProviderForCampaigns =
    await organizationRepository.findIdentityProviderForCampaignsByCampaignId(campaignId);

  if (!identityProviderForCampaigns) {
    return {};
  }

  const userIds = participations.map((participation) => participation.userId).filter(Number);
  const authenticationMethods = await authenticationMethodRepository.findByUserIdsAndIdentityProvider({
    userIds,
    identityProvider: identityProviderForCampaigns,
  });

  return authenticationMethods.reduce((externalIdentifiersByUserId, method) => {
    externalIdentifiersByUserId[method.userId] = method.externalIdentifier;
    return externalIdentifiersByUserId;
  }, {});
};

export const getCampaignParticipations = async ({
  campaignId,
  clientId,
  page,
  since,
  campaignsAPI,
  organizationRepository,
  authenticationMethodRepository,
}) => {
  const { models: campaignParticipations, meta } = await campaignsAPI.getCampaignParticipations({
    campaignId,
    page,
    since,
  });

  const externalIdentifierByUserId = await getExternalIdentifierByUserId(
    campaignId,
    campaignParticipations,
    organizationRepository,
    authenticationMethodRepository,
  );

  return {
    models: campaignParticipations.map((rawCampaignParticipation) => {
      rawCampaignParticipation.authenticationId = externalIdentifierByUserId[rawCampaignParticipation.userId] || null;
      return toDomain(rawCampaignParticipation, clientId, campaignId);
    }),
    meta,
  };
};

const toDomain = (rawCampaignParticipation, clientId, campaignId) =>
  new CampaignParticipation({
    ...rawCampaignParticipation,
    id: rawCampaignParticipation.id, // needed to invoke the getter
    tubes: rawCampaignParticipation.tubes?.map((tube) => new TubeCoverage(tube)),
    clientId,
    campaignId,
  });
