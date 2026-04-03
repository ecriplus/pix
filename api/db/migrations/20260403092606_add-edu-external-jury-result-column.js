const TABLE_NAME = 'assessment-results';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .string('eduV3ExternalJuryResult', 30)
      .nullable()
      .defaultTo(null)
      .comment('store v3 external jury result key (UNSET, ADVANCED or EXPERT)');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('eduV3ExternalJuryResult');
  });
};

export { down, up };
