const TABLE_NAME_1 = 'sco_certification_results';
const TABLE_NAME_2 = 'certification_results';
const COLUMN_NAME = 'configuration';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME_1, function (table) {
    table.jsonb(COLUMN_NAME).defaultTo(null).comment('Configuration of scoring for certification');
  });
  await knex.schema.table(TABLE_NAME_2, function (table) {
    table.jsonb(COLUMN_NAME).defaultTo(null).comment('Configuration of scoring for certification');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME_1, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
  await knex.schema.table(TABLE_NAME_2, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
