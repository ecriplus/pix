const TABLE_NAME = 'assessment-results';
const COLUMN_NAME = 'emitter';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).defaultTo(null).nullable().comment('DEPRECATED, this column will be unused soon').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).notNull().comment('').alter();
  });
};

export { down, up };
