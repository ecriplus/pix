import { CampaignTypes } from '../../models/CampaignTypes.js';

const createCampaigns = async function ({
  campaignsToCreate,
  campaignAdministrationRepository,
  membershipRepository,
  campaignRepository,
  campaignCodeGenerator,
}) {
  const enrichedCampaignsData = await Promise.all(
    campaignsToCreate.map(async (campaign) => {
      const [administrator] = await membershipRepository.findAdminsByOrganizationId({
        organizationId: campaign.organizationId,
      });

      return {
        ...campaign,
        ownerId: administrator.user.id,
        code: await campaignCodeGenerator.generate(campaignRepository),
        type: CampaignTypes.ASSESSMENT,
      };
    }),
  );

  return campaignAdministrationRepository.createCampaigns(enrichedCampaignsData);
};

export { createCampaigns };