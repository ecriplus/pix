const TABLE_NAME = 'organizations';
const COLUMN_NAME = 'countryCode';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .specificType(COLUMN_NAME, `integer CHECK ("${COLUMN_NAME}" BETWEEN 99000 AND 99999)`)
      .nullable()
      .comment('Country code (INSEE): five-digit numeric country code starting with 99.');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
