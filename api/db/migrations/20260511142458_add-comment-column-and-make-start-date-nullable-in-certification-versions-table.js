const TABLE_NAME = 'certification_versions';
const COMMENTS_COLUMN = 'comments';
const START_DATE_COLUMN = 'startDate';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(COMMENTS_COLUMN, 500).comment('Comments for version creation');
    table.timestamp(START_DATE_COLUMN).nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex(TABLE_NAME).update({ [START_DATE_COLUMN]: new Date('2030-01-01') });

  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COMMENTS_COLUMN);
    table.timestamp(START_DATE_COLUMN).notNullable().alter();
  });
};

export { down, up };
