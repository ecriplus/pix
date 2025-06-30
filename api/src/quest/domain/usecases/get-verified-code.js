import { VerifiedCode } from '../models/VerifiedCode.js';

export const getVerifiedCode = async ({ code, campaignRepository }) => {
  const campaign = await campaignRepository.getByCode({ code });

  return new VerifiedCode({ code: campaign.code });
};
