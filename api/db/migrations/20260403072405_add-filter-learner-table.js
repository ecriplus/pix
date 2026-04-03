const TABLE_NAME = 'organization_learner_filters';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.integer('organization_id').references('organizations.id').comment('Refers to organizations table').index();
    table
      .string('attribute_name')
      .comment('Refers to organization learners attributes key to identify specific filters');
    table.jsonb('values').comment('list of values we can use to filter attribute column');
    table.datetime('created_at').comment('creation date of filter');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
