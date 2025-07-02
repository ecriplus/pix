const TABLE_NAME = 'certification-frameworks-challenges';
const ALPHA_OLD_COLUMN_NAME = 'alpha';
const ALPHA_NEW_COLUMN_NAME = 'discriminant';
const DELTA_OLD_COLUMN_NAME = 'delta';
const DELTA_NEW_COLUMN_NAME = 'difficulty';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.renameColumn(ALPHA_OLD_COLUMN_NAME, ALPHA_NEW_COLUMN_NAME);
    table.renameColumn(DELTA_OLD_COLUMN_NAME, DELTA_NEW_COLUMN_NAME);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.renameColumn(ALPHA_NEW_COLUMN_NAME, ALPHA_OLD_COLUMN_NAME);
    table.renameColumn(DELTA_NEW_COLUMN_NAME, DELTA_OLD_COLUMN_NAME);
  });
};

export { down, up };
