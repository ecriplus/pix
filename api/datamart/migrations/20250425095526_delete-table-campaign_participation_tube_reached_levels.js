const TABLE_NAME = 'campaign_participation_tube_reached_levels';

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const down = async function () {
  // not needed as the table is not used
};

export { down, up };
