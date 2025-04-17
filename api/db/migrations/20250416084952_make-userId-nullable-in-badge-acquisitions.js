const TABLE_NAME = 'badge-acquisitions';
const COLUMN_NAME = 'userId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.integer(COLUMN_NAME).nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.integer(COLUMN_NAME).notNullable().alter();
  });
};

export { down, up };
