import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import { StageCollection } from '../../domain/models/StageCollection.js';
import { TargetProfileStageCollection } from '../../domain/models/TargetProfileStageCollection.js';

const MAX_STAGE_THRESHOLD = 100;

const getByTargetProfileId = async function (targetProfileId) {
  const knexConn = DomainTransaction.getConnection();

  const stages = await knexConn('stages').where({ targetProfileId }).orderBy('id', 'asc');
  const { max: maxLevel } = await knexConn('target-profile_tubes')
    .max('level')
    .where('targetProfileId', targetProfileId)
    .first();

  return new TargetProfileStageCollection({ id: targetProfileId, stages, maxLevel });
};

const update = async function (stageCollectionUpdate) {
  const knexConn = DomainTransaction.getConnection();

  const stageIdsToDelete = stageCollectionUpdate.stageIdsToDelete;
  const stagesToUpdate = stageCollectionUpdate.stagesToUpdate.map((stage) => ({
    id: stage.id,
    level: stage.level,
    threshold: stage.threshold,
    isFirstSkill: stage.isFirstSkill,
    title: stage.title,
    message: stage.message,
    prescriberTitle: stage.prescriberTitle,
    prescriberDescription: stage.prescriberDescription,
    targetProfileId: stage.targetProfileId,
  }));
  const stagesToCreate = stageCollectionUpdate.stagesToCreate.map((stage) => ({
    level: stage.level,
    threshold: stage.threshold,
    isFirstSkill: stage.isFirstSkill,
    title: stage.title,
    message: stage.message,
    prescriberTitle: stage.prescriberTitle,
    prescriberDescription: stage.prescriberDescription,
    targetProfileId: stage.targetProfileId,
  }));
  await knexConn.transaction(async (trx) => {
    await trx('stages').whereIn('id', stageIdsToDelete).del();
    await trx('stages')
      .insert([...stagesToCreate, ...stagesToUpdate])
      .onConflict('id')
      .merge();
  });
};

const findStageCollection = async function ({ campaignId }) {
  const knexConn = DomainTransaction.getConnection();

  const stages = await knexConn('stages')
    .select('stages.*')
    .join('campaigns', 'campaigns.targetProfileId', 'stages.targetProfileId')
    .where('campaigns.id', campaignId)
    .orderBy(['stages.threshold', 'stages.level']);

  await _computeStagesThresholdForCampaign(stages, campaignId);

  return new StageCollection({ campaignId, stages });
};

async function _computeStagesThresholdForCampaign(stages, campaignId) {
  const stagesWithLevel = stages.filter((stage) => stage.level || stage.level === 0);

  if (stagesWithLevel.length === 0) return;

  const skills = await _findSkills({ campaignId });

  stagesWithLevel.forEach((stage) => {
    stage.threshold = _computeStageThresholdForLevel(stage.level, skills);
  });
}

function _computeStageThresholdForLevel(level, skills) {
  if (skills.length === 0) {
    return MAX_STAGE_THRESHOLD;
  }

  const stageSkillsCount = skills.filter((skill) => skill.difficulty <= level).length;
  return Math.round((stageSkillsCount / skills.length) * 100);
}

async function _findSkills({ campaignId }) {
  const skillIds = await _findSkillIds({ campaignId });
  return skillRepository.findOperativeByIds(skillIds);
}

function _findSkillIds({ campaignId }) {
  const knexConn = DomainTransaction.getConnection();

  return knexConn('campaign_skills').where({ campaignId }).pluck('skillId');
}

export { findStageCollection, getByTargetProfileId, update };
