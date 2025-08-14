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
  const createdCampaigns = await campaignsApi.save(campaigns);
  return createdCampaigns.map((campaign) => new Campaign(campaign));
};
