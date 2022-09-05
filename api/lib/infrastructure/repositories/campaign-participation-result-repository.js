const CampaignParticipationResult = require('../../domain/models/CampaignParticipationResult');
const campaignParticipationRepository = require('./campaign-participation-repository');
const targetProfileRepository = require('./target-profile-repository');
const campaignRepository = require('./campaign-repository');
const competenceRepository = require('./competence-repository');
const assessmentRepository = require('./assessment-repository');
const knowledgeElementRepository = require('./knowledge-element-repository');

const campaignParticipationResultRepository = {
  async getByParticipationId(campaignParticipationId) {
    const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

    const [targetProfile, skillIds, competences, assessment, snapshots] = await Promise.all([
      targetProfileRepository.getByCampaignId(campaignParticipation.campaignId),
      campaignRepository.findSkillIds(campaignParticipation.campaignId),
      competenceRepository.list(),
      assessmentRepository.get(campaignParticipation.lastAssessment.id),
      knowledgeElementRepository.findSnapshotForUsers({
        [campaignParticipation.userId]: campaignParticipation.sharedAt,
      }),
    ]);

    return CampaignParticipationResult.buildFrom({
      campaignParticipationId,
      assessment,
      competences,
      targetProfile,
      skillIds,
      knowledgeElements: snapshots[campaignParticipation.userId],
    });
  },
};

module.exports = campaignParticipationResultRepository;
