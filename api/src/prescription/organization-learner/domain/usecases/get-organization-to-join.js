export const getOrganizationToJoin = async function ({
  code,
  organizationToJoinRepository,
  campaignRepository,
  questRepository,
}) {
  const campaign = await campaignRepository.getByCode(code);

  if (campaign) {
    return organizationToJoinRepository.get({ id: campaign.organizationId });
  }

  const quest = await questRepository.getByCode({ code });

  return organizationToJoinRepository.get({
    id: quest.organizationId,
  });
};
