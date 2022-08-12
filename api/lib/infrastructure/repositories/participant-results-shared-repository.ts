// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participan... Remove this comment to see the full error message
const ParticipantResultsShared = require('../../../lib/domain/models/ParticipantResultsShared');

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _fetchTargetedSkillIds(campaignParticipationId: $TSFixMe) {
  const skillIds = await knex('campaign-participations')
    .pluck('skillId')
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'campaigns.targetProfileId')
    .where('campaign-participations.id', campaignParticipationId);

  const targetedSkills = await skillDatasource.findOperativeByRecordIds(skillIds);
  return targetedSkills.map(({
    id
  }: $TSFixMe) => id);
}

async function _fetchKnowledgeElements(campaignParticipationId: $TSFixMe) {
  const { snapshot: knowledgeElements } = await knex('campaign-participations')
    .select('snapshot')
    .join('knowledge-element-snapshots', function(this: $TSFixMe) {
      this.on('knowledge-element-snapshots.userId', '=', 'campaign-participations.userId').andOn(
        'knowledge-element-snapshots.snappedAt',
        '=',
        'campaign-participations.sharedAt'
      );
    })
    .where('campaign-participations.id', campaignParticipationId)
    .first();
  return knowledgeElements;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participan... Remove this comment to see the full error message
const participantResultsSharedRepository = {
  async get(campaignParticipationId: $TSFixMe) {
    const targetedSkillIds = await _fetchTargetedSkillIds(campaignParticipationId);
    const knowledgeElements = await _fetchKnowledgeElements(campaignParticipationId);

    return new ParticipantResultsShared({ campaignParticipationId, knowledgeElements, targetedSkillIds });
  },
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = participantResultsSharedRepository;
