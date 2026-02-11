const TABLE_NAME = 'sessions';
const INDEX_NAME = 'sessions_accesscode_index';
const COLUMN_NAME = 'accessCode';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS ??;`, [INDEX_NAME]);
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

// DROP INDEX CONCURRENTLY cannot run inside a transaction block
const config = { transaction: false };

export { config, down, up };
