export class CampaignParticipation {
  constructor({
    id,
    campaignId,
    targetProfileId,
    organizationLearnerId,
    status,
    masteryRate,
    validatedSkillsCount,
    totalStagesCount,
    validatedStagesCount,
  }) {
    this.id = id;
    this.campaignId = campaignId;
    this.targetProfileId = targetProfileId;
    this.organizationLearnerId = organizationLearnerId;
    this.status = status;
    this.masteryRate = masteryRate ?? null;
    this.validatedSkillsCount = validatedSkillsCount ?? null;
    this.totalStagesCount = totalStagesCount ?? null;
    this.validatedStagesCount = validatedStagesCount ?? null;
  }
}
