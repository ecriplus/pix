const createCampaigns = async function ({
  campaignsToCreate,
  campaignAdministrationRepository,
  accessCodeRepository,
  campaignCreatorRepository,
  codeGenerator,
  userRepository,
  organizationRepository,
}) {
  const enrichedCampaignsData = [];
  for (const campaign of campaignsToCreate) {
    await _checkIfOwnerIsExistingUser(userRepository, campaign.ownerId);
    await _checkIfOrganizationExists(organizationRepository, campaign.organizationId);

    const generatedCampaignCode = await codeGenerator.generate(accessCodeRepository);
    const campaignCreator = await campaignCreatorRepository.get(campaign.organizationId);

    const campaignToCreate = await campaignCreator.createCampaign({
      ...campaign,
      code: generatedCampaignCode,
    });
    enrichedCampaignsData.push(campaignToCreate);
  }
  return campaignAdministrationRepository.save(enrichedCampaignsData);
};

const _checkIfOwnerIsExistingUser = async function (userRepository, userId) {
  await userRepository.get(userId);
};

const _checkIfOrganizationExists = async function (organizationRepository, organizationId) {
  await organizationRepository.get(organizationId);
};

export { createCampaigns };
