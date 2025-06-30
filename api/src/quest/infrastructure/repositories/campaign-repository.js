import { Campaign } from '../../domain/models/Campaign.js';

export const getByCode = async function ({ code, campaignsApi }) {
  const campaign = await campaignsApi.getByCode(code);
  return new Campaign(campaign);
};
