import { REWARD_TYPES } from '../../src/quest/domain/constants.js';

const TABLE_NAME = 'profile-rewards';

const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text('rewardType').defaultTo(REWARD_TYPES.ATTESTATION).alter();
    table.bigInteger('rewardId').notNullable().alter();
  });
};

const down = async function (knex) {
  await knex.raw('ALTER TABLE "profile-rewards" ALTER COLUMN "rewardType" DROP DEFAULT;');
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.string('rewardId').notNullable().alter();
  });
};

export { down, up };
