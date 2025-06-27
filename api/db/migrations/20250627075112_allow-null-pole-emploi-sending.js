const TABLE_NAME = 'pole-emploi-sendings';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table
      .text('responseCode')
      .defaultTo(null)
      .nullable()
      .comment('DEPRECATED, this column will be unused / renamed soon')
      .alter();
    table
      .boolean('isSuccessful')
      .defaultTo(null)
      .nullable()
      .comment('DEPRECATED, this column will be removed soon')
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text('responseCode').notNull().comment('').alter();
    table.boolean('isSuccessful').notNull().comment('').alter();
  });
};

export { down, up };
