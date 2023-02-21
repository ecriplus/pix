const { knex } = require('../../../../db/knex-database-connection');
const StageCollection = require('../../../domain/models/target-profile-management/StageCollection');

module.exports = {
  async getByTargetProfileId(targetProfileId) {
    const stages = await knex('stages').where({ targetProfileId }).orderBy('id', 'asc');
    const { max: maxLevel } = await knex('target-profile_tubes')
      .max('level')
      .where('targetProfileId', targetProfileId)
      .first();

    return new StageCollection({ id: targetProfileId, stages, maxLevel });
  },

  async save(stageCollection) {
    const rawIds = await knex('stages').insert(stageCollection.stages).onConflict('id').merge().returning('id');
    return rawIds.map((rawId) => rawId.id);
  },
};