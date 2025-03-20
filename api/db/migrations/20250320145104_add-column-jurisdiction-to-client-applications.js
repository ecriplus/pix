const TABLE_NAME = 'client_applications';
const COLUMN_NAME = 'jurisdiction';

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .jsonb(COLUMN_NAME)
      .defaultTo(null)
      .comment("Juridiction de données de l'application : organisations, centres de certification ou autres.");
  });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
