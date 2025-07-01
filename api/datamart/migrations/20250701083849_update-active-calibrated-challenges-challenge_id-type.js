const TABLE_NAME = 'active_calibrated_challenges';
const COLUMN_NAME = 'calibration_id';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.integer(COLUMN_NAME).defaultTo(null).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.string(COLUMN_NAME).defaultTo(null).alter();
  });
};

export { down, up };
