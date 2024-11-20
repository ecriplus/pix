import { REWARD_TYPES } from '../../src/quest/domain/constants.js';
export const PROFILE_REWARDS_TABLE_NAME = 'profile-rewards';

const up = async function (knex) {
  await knex.schema.createTable(PROFILE_REWARDS_TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.bigInteger('userId').index().references('users.id');
    table.enum('rewardType', [REWARD_TYPES.ATTESTATION]).defaultTo(REWARD_TYPES.ATTESTATION);
    table.bigInteger('rewardId').notNullable();
  });
};

const down = async function (knex) {
  return knex.schema.dropTable(PROFILE_REWARDS_TABLE_NAME);
};

export { down, up };
