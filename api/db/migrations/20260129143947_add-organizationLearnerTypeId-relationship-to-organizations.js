const TABLE_NAME = 'organizations';
const COLUMN_NAME = 'organizationLearnerTypeId';

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
      .references('organization_learner_types.id')
      .comment("Reference to the organization's organization learner type.");
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
