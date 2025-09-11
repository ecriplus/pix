import { Campaign } from '../../domain/models/Campaign.js';

export const getByCode = async function ({ code, campaignsApi }) {
  const campaign = await campaignsApi.getByCode(code);
  return new Campaign(campaign);
};

export const get = async function ({ id, campaignsApi }) {
  const campaign = await campaignsApi.get(id);
  return new Campaign(campaign);
};

export const save = async function ({ campaigns, campaignsApi }) {
  const campaignToCreate = campaigns.map(_toDTO);
  const createdCampaigns = await campaignsApi.save(campaignToCreate, { allowCreationWithoutTargetProfileShare: true });
  return createdCampaigns.map((campaign) => new Campaign(campaign));
};

const _toDTO = (campaign) => {
  return {
    ...campaign,
    type: 'ASSESSMENT',
    multipleSendings: false,
  };
};
