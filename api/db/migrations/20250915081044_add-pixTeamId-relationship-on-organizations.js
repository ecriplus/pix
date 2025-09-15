const TABLE_NAME = 'organizations';
const COLUMN_NAME = 'pixTeamId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .integer(COLUMN_NAME)
      .defaultTo(null)
      .nullable()
      .references('pix-teams.id')
      .index()
      .comment("Reference to the organization's PIX team");
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
