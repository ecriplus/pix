import { CampaignTypes } from '../../../shared/domain/constants.js';

const getCampaignByCode = async function ({
  code,
  locale,
  campaignToJoinRepository,
  organizationLearnerImportFormatRepository,
  campaignMediaComplianceService,
}) {
  const campaignToJoin = await campaignToJoinRepository.getByCode({ code });

  if (campaignToJoin.isRestricted) {
    const config = await organizationLearnerImportFormatRepository.get(campaignToJoin.organizationId);

    if (config) campaignToJoin.setReconciliationFields(config.reconciliationFields);
  }

  if (campaignToJoin.type === CampaignTypes.ASSESSMENT) {
    const campaignMediaCompliance = await campaignMediaComplianceService.getMediaCompliance(campaignToJoin, locale);
    campaignToJoin.setMediaCompliance(campaignMediaCompliance);
  }

  return campaignToJoin;
};

export { getCampaignByCode };
