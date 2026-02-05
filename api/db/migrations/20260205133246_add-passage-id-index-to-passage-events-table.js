const TABLE_NAME = 'passage-events';
const COLUMN_NAME = 'passageId';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.index(COLUMN_NAME);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropIndex(COLUMN_NAME);
  });
};

export { down, up };
