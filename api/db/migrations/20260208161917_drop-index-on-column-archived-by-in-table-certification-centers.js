const TABLE_NAME = 'certification-centers';
const INDEX_NAME = 'certification_centers_archivedby_index';
const COLUMN_NAME = 'archivedBy';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.raw(`DROP INDEX IF EXISTS ??;`, [INDEX_NAME]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.index(COLUMN_NAME, INDEX_NAME);
  });
};

export { down, up };
