const TABLE_NAME = 'quests';
const COLUMN_NAME = 'rewardId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  return knex.raw('create index if not exists "quests_rewardid_index" on quests ("rewardId")');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.dropIndex(COLUMN_NAME);
  });
};

export { down, up };
