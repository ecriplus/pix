const TABLE_NAME = 'combined_course_blueprints';
const COLUMN_NAME = 'successRequirements';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.renameColumn(COLUMN_NAME, 'content');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.renameColumn('content', COLUMN_NAME);
  });
};

export { down, up };
