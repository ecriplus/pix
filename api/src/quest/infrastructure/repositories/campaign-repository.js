import { Campaign } from '../../domain/models/Campaign.js';

//TODO: deux méthodes a tester
export const getByCode = async function ({ code, campaignsApi }) {
  const campaign = await campaignsApi.getByCode(code);
  return new Campaign(campaign);
};

export const get = async function ({ id, campaignsApi }) {
  const campaign = await campaignsApi.get(id);
  return new Campaign(campaign);
};
