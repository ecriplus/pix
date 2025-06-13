import { NotFoundError } from '../../../../shared/domain/errors.js';

export const getOrganizationToJoin = async function ({ code, organizationToJoinRepository, campaignRepository }) {
  const campaign = await campaignRepository.getByCode(code);
  if (!campaign) {
    throw new NotFoundError('Aucun parcours trouvé pour le code ' + code);
  }
  return organizationToJoinRepository.get({
    id: campaign.organizationId,
  });
};
